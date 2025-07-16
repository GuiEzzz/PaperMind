'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (data.success) {
        router.push('/doc');
    } else {
      setErrorMessage('Usuário ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-gray-900 bg-opacity-95 rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
        {/* Branding */}
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="mb-4 drop-shadow-lg">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#2563eb" />
          <path d="M12 7v7m0 0l3-3m-3 3l-3-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="text-3xl font-extrabold text-blue-400 mb-1 text-center drop-shadow">
          PaperMind
        </h1>
        <div className="text-gray-400 mb-6 text-center text-base font-medium">
          Acesse sua conta
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          {errorMessage && (
            <div className="bg-red-800/30 text-red-300 border border-red-700 rounded-md px-4 py-2 text-sm font-medium text-center shadow">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="text-sm text-blue-200 block mb-1 font-semibold">Usuário</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-800/80 text-blue-100 border border-gray-700 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition shadow"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm text-blue-200 block mb-1 font-semibold">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 pr-12 bg-gray-800/80 text-blue-100 border border-gray-700 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition shadow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors"
                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-blue-300 hover:text-blue-400" />
                ) : (
                  <Eye className="w-5 h-5 text-blue-400 hover:text-blue-300" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-xl shadow-lg tracking-wide text-lg"
          >
            Entrar
          </button>
        </form>
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
