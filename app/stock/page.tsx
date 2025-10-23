'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  currentStock: number;
  minStock: number;
}

interface StockMovement {
  _id: string;
  product: {
    _id: string;
    name: string;
    category: string;
  };
  type: 'entrada' | 'saida';
  quantity: number;
  date: string;
  responsible: {
    _id: string;
    name: string;
    username: string;
  };
  notes: string;
  createdAt: string;
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [movementType, setMovementType] = useState<'entrada' | 'saida'>('entrada');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'movement' | 'history'>('movement');
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchMovements();
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/stock');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovements = async () => {
    try {
      const response = await fetch('/api/stock/history');
      if (response.ok) {
        const data = await response.json();
        setMovements(data.movements);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validação cliente: quantidade positiva e evitar estoque negativo em saída
    const qty = Number(quantity);
    if (!selectedProduct) {
      setAlertMessage('Selecione um produto.');
      return;
    }
    if (!qty || qty <= 0) {
      setAlertMessage('Informe uma quantidade válida (> 0).');
      return;
    }
    if (movementType === 'saida') {
      const prod = products.find((p) => p._id === selectedProduct);
      if (!prod) {
        setAlertMessage('Produto não encontrado.');
        return;
      }
      if (qty > prod.currentStock) {
        setAlertMessage('Quantidade de saída maior que o estoque atual. Operação cancelada.');
        return;
      }
    }

    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct,
          type: movementType,
          quantity: Number(quantity),
          date,
          notes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertMessage(data.alert);
        fetchProducts();
        fetchMovements();
        setSelectedProduct('');
        setQuantity('');
        setNotes('');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erro no movimento de estoque:', error);
      alert('Ocorreu um erro');
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
    <div className="min-h-screen bg-black text-white p-6">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestão de Estoque</h1>
        <button onClick={() => router.push('/dashboard')} className="py-1 px-3 bg-gray-800 rounded">Voltar</button>
      </header>

      <nav className="mb-4">
        <button onClick={() => setActiveTab('movement')} className={`py-1 px-3 rounded ${activeTab === 'movement' ? 'bg-white text-black' : 'bg-gray-800'}`}>Registrar Movimento</button>
        <button onClick={() => setActiveTab('history')} className={`py-1 px-3 rounded ml-2 ${activeTab === 'history' ? 'bg-white text-black' : 'bg-gray-800'}`}>Histórico</button>
      </nav>

      {alertMessage && <div className="mb-4 p-3 bg-gray-800 rounded">{alertMessage}</div>}

      {activeTab === 'movement' && (
        <div className="mb-6 p-4 bg-gray-900 rounded border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300">Produto</label>
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full mt-1 px-3 py-2 bg-black border border-gray-700 rounded">
                <option value="">Selecione</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.currentStock})</option>)}
              </select>
            </div>

            <div className="flex gap-2">
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="px-3 py-2 bg-black border border-gray-700 rounded" placeholder="Quantidade" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 bg-black border border-gray-700 rounded" />
            </div>

            <div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full mt-1 px-3 py-2 bg-black border border-gray-700 rounded" placeholder="Observações (opcional)" />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="py-2 px-3 bg-white text-black rounded">Registrar</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-4 bg-gray-900 rounded border border-gray-800">
          <h3 className="font-semibold mb-3">Histórico</h3>
          <div>
            {movements.length === 0 ? (
              <p className="text-gray-400">Nenhum movimento registrado.</p>
            ) : (
              movements.map(m => (
                <div key={m._id} className="mb-2 p-2 bg-gray-800 rounded">
                  <div className="text-sm font-medium">{m.product.name} — {m.type}</div>
                  <div className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString('pt-BR')} — {m.quantity}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* visão geral simplificada */}
      {activeTab === 'movement' && (
        <div className="p-4 bg-gray-900 rounded border border-gray-800 mt-4">
          <h3 className="font-semibold mb-3">Produtos</h3>
          <div className="space-y-2">
            {products.map(p => (
              <div key={p._id} className="flex justify-between text-sm text-gray-300">
                <span>{p.name}</span>
                <span>{p.currentStock}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
