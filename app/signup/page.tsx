'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?message=Conta criada com sucesso');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg border border-gray-800">
        <h2 className="text-center text-2xl font-bold text-white mb-2">
          Criar Conta
        </h2>
        <p className="text-center text-sm text-gray-400 mb-4">
          Junte-se ao Inventario App
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">
              Nome completo
            </label>
            <input
              className="w-full mt-1 px-3 py-2 bg-black border border-gray-700 text-white rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">
              Usuário
            </label>
            <input
              className="w-full mt-1 px-3 py-2 bg-black border border-gray-700 text-white rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">
              Senha
            </label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gray-800 text-white rounded border border-gray-700"
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-gray-400 text-sm"
            >
              Já tem conta? Entrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
