import FileUpload from "@/components/FileUpload";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-gray-900 bg-opacity-95 rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="mb-4">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#2563eb" />
          <path d="M12 7v7m0 0l3-3m-3 3l-3-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="text-3xl font-extrabold text-blue-400 mb-2 text-center drop-shadow">
          PaperMind
        </h1>
        <p className="text-gray-300 mb-6 text-center p-5">
          Faça upload de contratos, manuais, termos ou qualquer documento escaneado e converse com o conteúdo!
        </p>
        <FileUpload />
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px);}
          to   { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </main>
  );
}
