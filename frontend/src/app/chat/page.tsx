"use client";
import { useSearchParams } from "next/navigation";
import ChatBox from "@/components/ChatBox";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <h2 className="text-white">Documento não encontrado. Volte e faça upload novamente.</h2>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">Pergunte sobre seu documento</h1>
      <ChatBox documentId={documentId} />
    </main>
  );
}
