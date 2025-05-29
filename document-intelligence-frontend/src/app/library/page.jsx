'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LibraryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/documents/');
      const data = await res.json();
      setDocuments(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/documents/${id}/`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      } else {
        console.error('Failed to delete document');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Document Library</h1>
      {loading ? (
        <p>Loading...</p>
      ) : documents.length === 0 ? (
        <p>No documents uploaded.</p>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded p-4 shadow hover: transition">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{doc.title}</div>

                  <div className="flex items-center justify-between">
  

  <span className={`
    text-xs px-2 py-1 rounded-full font-medium
    ${doc.processing_status === 'completed' ? 'bg-green-100 text-green-800' :
      doc.processing_status === 'processing' ? 'bg-yellow-100 text-yellow-800 animate-pulse' :
      'bg-red-100 text-red-800'}
  `}>
    {doc.processing_status}
  </span>
</div>

                  <div className="text-sm text-gray-600">
                    Type: {doc.file_type.toUpperCase()} | Pages: {doc.pages}
                  </div>
                  <div className="text-sm text-gray-500">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-700">Status: {doc.processing_status}</div>
                  <Link href={`/chat/${doc.id}`} className="text-blue-600 hover:underline inline-block mt-1">
                    Open Chat →
                  </Link>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
