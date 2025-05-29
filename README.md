# 📄 **Document Intelligence Platform (RAG-Based)**

A full-stack platform that lets users upload documents (PDF, DOCX, TXT) and ask natural language questions about them. It uses a **Retrieval-Augmented Generation (RAG)** pipeline with local LLMs via **LM Studio**, vector search via **ChromaDB**, and a session-aware chat interface.

---

## 🧠 **Features**

- Upload and process PDF, DOCX, and TXT files
- Extract, chunk, and embed document text
- Store chunks in Chroma vector database
- Ask natural language questions using RAG
- Contextual answers with **chunk-level source citations**
- Session-based chat with history (persists on reload)
- Document status indicators (processing, completed, failed)

---

## ⚙️ **Tech Stack**

| Layer      | Tech                             |
|------------|----------------------------------|
| Frontend   | Next.js + Tailwind CSS           |
| Backend    | Django REST Framework (DRF)      |
| Embeddings | SentenceTransformers (MiniLM)    |
| Vector DB  | ChromaDB                         |
| LLM        | Mistral 7B via **LM Studio**     |

---

## 🚀 **Getting Started**

### ✅ **1. Clone the Repository**

git clone https://github.com/AruniAgam/document-intelligence-rag.git
cd document-intelligence-rag

### 2. Start the Backend (Django + DRF)
cd document-intelligence-backend

Create and activate virtual environment
python -m venv env  

source env/bin/activate 
Use `.\env\Scripts\activate` on Windows

Install dependencies:
pip install -r requirements.txt

Apply migrations and start server:

python manage.py migrate

python manage.py runserver

## 3. Start the Frontend (Next.js)
cd ../document-intelligence-frontend

 Install frontend dependencies:
 npm install

Start the development server:
npm run dev

## 4. Launch LM Studio (Local LLM)
Download and install LM Studio

Go to the Developer tab

Load the model:
mistralai_-_mistral-7b-instruct-v0.1

Ensure it's reachable at:
http://localhost:1234/v1/chat/completions

Keep LM Studio running while asking questions

   


