import pdfplumber
from docx import Document as DocxDocument


from sentence_transformers import SentenceTransformer
import chromadb

model = SentenceTransformer('all-MiniLM-L6-v2')
chroma_client = chromadb.Client()
chroma_collection = chroma_client.get_or_create_collection(name="doc_chunks")



def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_path):
    doc = DocxDocument(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text_from_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_text(file_path, file_type):
    if file_type == 'pdf':
        return extract_text_from_pdf(file_path)
    elif file_type == 'docx':
        return extract_text_from_docx(file_path)
    elif file_type == 'txt':
        return extract_text_from_txt(file_path)
    else:
        raise ValueError("Unsupported file type")

def chunk_text(text, max_chunk_size=500, overlap=100):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = words[i:i+max_chunk_size]
        chunks.append(" ".join(chunk))
        i += max_chunk_size - overlap
    return chunks



def embed_and_store_chunks(chunks, doc_id):
    embeddings = model.encode(chunks).tolist()
    ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
    metadatas = [{"doc_id": doc_id, "chunk_index": i} for i in range(len(chunks))]

    chroma_collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas
    )




