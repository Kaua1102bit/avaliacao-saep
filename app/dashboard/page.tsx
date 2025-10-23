'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  name: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Inventario App</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Bem-vindo, {user.name}</span>
            <button onClick={handleLogout} className="py-1 px-3 bg-gray-800 rounded border border-gray-700">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-semibold mb-6">Painel de Controle</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 md:p-10 bg-gray-900 rounded-lg border border-gray-800 min-h-[220px] flex flex-col justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Gestão de Produtos</h3>
              <p className="text-sm md:text-base text-gray-400 mb-6">Registre e gerencie produtos</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => router.push('/products')}
                className="py-3 px-5 bg-white text-black rounded-lg text-sm md:text-base font-semibold shadow"
              >
                Ir para Produtos →
              </button>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-gray-900 rounded-lg border border-gray-800 min-h-[220px] flex flex-col justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Gestão de Estoque</h3>
              <p className="text-sm md:text-base text-gray-400 mb-6">Gerencie movimentos e controle</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => router.push('/stock')}
                className="py-3 px-5 bg-white text-black rounded-lg text-sm md:text-base font-semibold shadow"
              >
                Ir para Estoque →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
