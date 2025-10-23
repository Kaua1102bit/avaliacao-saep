'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg border border-gray-800">
        <h2 className="text-center text-2xl font-bold text-white mb-2">Bem-vindo</h2>
        <p className="text-center text-sm text-gray-400 mb-4">Entre na sua conta</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Usuário</label>
            <input
              className="w-full mt-1 px-3 py-2 bg-black border border-gray-700 text-white rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Senha</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 bg-black border border-gray-700 text-white rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-white bg-gray-800 p-2 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="text-sm text-black bg-gray-200 p-2 rounded">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gray-800 text-white rounded border border-gray-700"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="text-center">
            <Link href="/signup" className="text-gray-400 text-sm">
              Não tem conta? Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
