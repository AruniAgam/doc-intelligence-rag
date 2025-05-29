from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status

from .document_processor import extract_text, chunk_text, embed_and_store_chunks
from .models import Document, DocumentChunk, ChatSession, ChatMessage
from .serializers import DocumentSerializer

import requests
from sentence_transformers import SentenceTransformer
import chromadb

# Initialize embedding + Chroma
model = SentenceTransformer('all-MiniLM-L6-v2')
chroma_client = chromadb.Client()
chroma_collection = chroma_client.get_or_create_collection(name="doc_chunks")

# -----------------------------------
# Upload Document
# -----------------------------------
@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_document(request):
    file = request.FILES.get('file')
    if not file:
        return Response({'error': 'No file provided.'}, status=400)

    document = Document.objects.create(
        title=file.name,
        file=file,
        file_type=file.name.split('.')[-1].lower(),
        size=file.size,
        processing_status='processing'
    )

    try:
        text = extract_text(document.file.path, document.file_type)
        chunks = chunk_text(text)

        for i, chunk in enumerate(chunks):
            DocumentChunk.objects.create(
                document=document,
                content=chunk,
                chunk_index=i
            )
        embed_and_store_chunks(chunks, document.id)

        document.processing_status = 'completed'
    except Exception as e:
        print(f"[Error] Document processing failed: {e}")
        document.processing_status = 'failed'

    document.save()
    serializer = DocumentSerializer(document)
    return Response(serializer.data, status=201)

# -----------------------------------
# List Documents
# -----------------------------------
@api_view(['GET'])
def list_documents(request):
    documents = Document.objects.all().order_by('-uploaded_at')
    serializer = DocumentSerializer(documents, many=True)
    return Response(serializer.data)

# -----------------------------------
# Delete Document
# -----------------------------------
@api_view(['DELETE'])
def delete_document(request, doc_id):
    try:
        document = Document.objects.get(id=doc_id)
        document.delete()
        return Response({'message': 'Document deleted.'})
    except Document.DoesNotExist:
        return Response({'error': 'Document not found.'}, status=404)

# -----------------------------------
# Ask Question via RAG + LM Studio
# -----------------------------------
@api_view(['POST'])
def ask_question(request):
    doc_id = request.data.get('document_id')
    question = request.data.get('question')
    top_k = int(request.data.get('top_k', 4))
    chat_session_id = request.data.get('chat_session_id')

    if not doc_id or not question:
        return Response({"error": "document_id and question are required."}, status=400)

    # Step 1: Embed the question
    question_embedding = model.encode(question).tolist()

    # Step 2: Semantic search from ChromaDB
    results = chroma_collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k
    )
    top_chunks = results['documents'][0]
    metadatas = results['metadatas'][0]
    context = "\n\n".join(top_chunks)

    # Step 3: Construct prompt
    prompt = f"""You are an intelligent assistant. Answer the question based only on the context below:

Context:
{context}

Question: {question}
Answer:"""

    # Step 4: Send to LM Studio
    try:
        response = requests.post(
            "http://localhost:1234/v1/chat/completions",
            headers={"Content-Type": "application/json"},
            json={
                "model": "mistralai_-_mistral-7b-instruct-v0.1",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
        )
        response.raise_for_status()
        data = response.json()
        answer = data['choices'][0]['message']['content'].strip()
    except Exception as e:
        print("[LM Studio Error]", str(e))
        return Response({"error": "Failed to get response from LM Studio"}, status=500)

    # Step 5: Save chat session
    session = ChatSession.objects.filter(id=chat_session_id).first() if chat_session_id else ChatSession.objects.create(document_id=doc_id)

    ChatMessage.objects.create(
        session=session,
        question=question,
        answer=answer
    )

    return Response({
        "answer": answer,
        "chat_session_id": session.id,
        "sources": metadatas
    })

# -----------------------------------
# Get Chat History
# -----------------------------------
@api_view(['GET'])
def get_chat_history(request, session_id):
    messages = ChatMessage.objects.filter(session_id=session_id).order_by('created_at')
    chat = []
    for msg in messages:
        chat.append({"type": "question", "text": msg.question})
        chat.append({"type": "answer", "text": msg.answer})
    return Response(chat)
