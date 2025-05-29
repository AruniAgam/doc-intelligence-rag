'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ChatPage() {
  const { docId } = useParams();
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);

  // Load saved session ID from localStorage on first render
  useEffect(() => {
    const storedSessionId = localStorage.getItem(`chat_session_${docId}`);
    console.log("Loaded session from storage:", storedSessionId);
    if (storedSessionId) {
      setChatSessionId(parseInt(storedSessionId));
    }
  }, [docId]);

  // Load chat history when session ID is set
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!chatSessionId) return;

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/chat-history/${chatSessionId}/`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadChatHistory();
  }, [chatSessionId]);

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { type: 'question', text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/ask-question/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id: parseInt(docId),
          question: question,
          chat_session_id: chatSessionId,
          top_k: 4,
        }),
      });

     if (!res.ok) {
  const errorText = await res.text();
  console.error("API error response:", res.status, errorText);
  throw new Error('Failed to get answer');
}


      const data = await res.json();

      // Save session ID to state and localStorage
      if (!chatSessionId && data.chat_session_id) {
        setChatSessionId(data.chat_session_id);
        localStorage.setItem(`chat_session_${docId}`, data.chat_session_id);
      }

      console.log("API response:", data);
console.log("Sources type:", typeof data.sources, Array.isArray(data.sources));

     const botMessage = {
        type: 'answer',
      text: data.answer || 'No answer returned.',
       sources: data.sources || [],
};

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { type: 'answer', text: 'Error getting response.' }]);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  const clearChat = () => {
    localStorage.removeItem(`chat_session_${docId}`);
    setMessages([]);
    setChatSessionId(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Chat with Document #{docId}</h1>

      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">
          {chatSessionId ? `Session ID: ${chatSessionId}` : 'No session started'}
        </span>
        <button
          onClick={clearChat}
          className="text-sm text-red-600 hover:underline"
        >
          Clear Chat
        </button>
      </div>

      <div className="border rounded p-4 h-[400px] overflow-y-auto space-y-4 mb-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.type === 'question' ? 'bg-pink-500 text-right' : 'bg-green-500 text-left'
            }`}
          >
            <p>{msg.text}</p>
             {/* Show sources under answer */}
      {msg.type === 'answer'&& Array.isArray(msg.sources) && msg.sources && msg.sources.length > 0 && (
      <div className="mt-1 text-xs text-gray-200">
        Sources:{' '}
        {msg.sources.map((src, i) => (
          <span key={i}>
            Chunk #{src.chunk_index}
            {src.page_number ? ` (Page ${src.page_number})` : ''}{' '}
            {i < msg.sources.length - 1 ? '· ' : ''}
          </span>
        ))}
      </div>
    )}

            

          </div>
        ))}
        {loading && <p className="italic text-gray-500">Generating answer...</p>}
      </div>

      <textarea
        rows={2}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border rounded mb-2"
        placeholder="Type your question and press Enter..."
      />
      <button
        onClick={askQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        Ask
      </button>
    </div>
  );
}
