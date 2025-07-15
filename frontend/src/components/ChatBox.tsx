"use client";
import React, { useState, useRef, useEffect } from "react";

// Avatares simples (substitua por imagem se quiser)
const AssistantAvatar = () => (
  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
    <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" fill="#fff" /></svg>
  </div>
);
const UserAvatar = () => (
  <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
    <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" fill="#2563eb" /></svg>
  </div>
);

interface Message {
  type: "user" | "assistant";
  text: string;
  source?: string;
}

interface ChatBoxProps {
  documentId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ documentId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll automático animado sempre que novas mensagens são adicionadas
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { type: "user", text: input }]);
    setLoading(true);

    setInput("");

    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        documentId,
        question: input
      })
    });
    const data = await res.json();
    const answer = data.answer;
    
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          type: "assistant",
          text: answer,
          source: "Fonte: Este é um trecho simulado do documento original.",
        },
      ]);
      setLoading(false);
    }, 1200);

  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col">
      <div
        ref={chatRef}
        className="border border-gray-800 bg-gray-900 rounded-lg p-6 shadow-inner custom-scrollbar"
        style={{ height: "600px", overflowY: "auto" }}
      
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg animate-pulse">
            Faça sua primeira pergunta sobre o documento!
          </div>
        )}
        <ul className="space-y-4">
          {messages.map((msg, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-3 ${
                msg.type === "user" ? "flex-row-reverse" : ""
              } animate-fadeIn`}
            >
              {msg.type === "user" ? <UserAvatar /> : <AssistantAvatar />}
              <div className="max-w-[75%]">
                <div
                  className={`px-4 py-2 rounded-2xl shadow
                  ${
                    msg.type === "user"
                      ? "bg-blue-700 text-white rounded-br-none"
                      : "bg-gray-800 text-blue-100 rounded-bl-none"
                  }`}
                >
                  <span>{msg.text}</span>
                </div>
                {msg.type === "assistant" && msg.source && (
                  <div className="mt-2 ml-2 px-3 py-2 text-sm italic rounded bg-blue-950 bg-opacity-70 text-blue-200 border-l-4 border-blue-600 shadow">
                    {msg.source}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Área de digitação */}
      <form
        className="flex items-end gap-2 mt-4 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) sendMessage();
        }}
      >
        <div className="flex-1 relative">
          <textarea
            className="w-full resize-none border border-gray-700 bg-gray-800/80 text-gray-100 px-4 py-3 pr-12 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition placeholder-gray-400"
            rows={1}
            maxLength={800}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!loading) sendMessage();
              }
            }}
            autoFocus
          />
          {/* Botão de envio com aviãozinho */}
          <div className="absolute right-3 bottom-3 flex items-center">
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-full shadow-md disabled:opacity-40 flex items-center justify-center"
              disabled={loading || !input.trim()}
              aria-label="Enviar"
            >
              {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.3}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-7.5-15-7.5v6.75L16.5 12l-12 1.5z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
      <style>{`
        /* Custom scrollbar para dark mode/azul */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #2563eb #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: #1e293b;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #2563eb 60%, #1e40af 100%);
          border-radius: 8px;
          border: 2px solid #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #1d4ed8 80%, #2563eb 100%);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s;
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
