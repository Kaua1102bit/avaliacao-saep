'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  size: string;
  weight: number;
  material: string;
  currentStock: number;
  minStock: number;
  price: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    size: '',
    weight: '',
    material: '',
    minStock: '',
    price: '',
    currentStock: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const url = searchTerm ? `/api/products?search=${encodeURIComponent(searchTerm)}` : '/api/products';
      const response = await fetch(url);
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

  const handleSearch = () => {
    fetchProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          weight: Number(formData.weight),
          minStock: Number(formData.minStock),
          price: Number(formData.price),
          currentStock: Number(formData.currentStock),
        }),
      });

      if (response.ok) {
        fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          category: '',
          size: '',
          weight: '',
          material: '',
          minStock: '',
          price: '',
          currentStock: '',
        });
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Erro ao enviar produto:', error);
      alert('Ocorreu um erro');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      size: product.size,
      weight: product.weight.toString(),
      material: product.material,
      minStock: product.minStock.toString(),
      price: product.price.toString(),
      currentStock: product.currentStock.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      } else {
        alert('Erro ao excluir produto');
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
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
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestão de Produtos</h1>
        <button onClick={() => router.push('/dashboard')} className="py-1 px-3 bg-gray-800 rounded border border-gray-700">
          Voltar
        </button>
      </header>

      <div className="mb-4 flex gap-3">
        <input
          className="px-3 py-2 bg-black border border-gray-700 rounded"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="py-2 px-3 bg-gray-800 rounded">
          Buscar
        </button>
        <button onClick={() => setShowForm(true)} className="py-2 px-3 bg-white text-black rounded">
          Adicionar
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-gray-900 rounded border border-gray-800">
          <h2 className="font-semibold mb-2">{editingProduct ? 'Editar' : 'Adicionar'} Produto</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">Nome</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 bg-gray-900 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Categoria</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 bg-gray-900 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-200">Descrição</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 bg-gray-900 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Tamanho</label>
              <input
                type="text"
                required
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 bg-gray-900 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 bg-gray-900 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Material</label>
              <input
                type="text"
                required
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 bg-gray-900 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Estoque Mínimo</label>
              <input
                type="number"
                required
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 bg-gray-900 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Preço</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 bg-gray-900 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Estoque Atual</label>
              <input
                type="number"
                min="0"
                required
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 bg-gray-900 text-white"
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    description: '',
                    category: '',
                    size: '',
                    weight: '',
                    material: '',
                    minStock: '',
                    price: '',
                    currentStock: '',
                  });
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-gray-700"
              >
                {editingProduct ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-gray-900 rounded border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <strong>{product.name}</strong>
              <span className="text-sm text-gray-300">{product.category}</span>
            </div>
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">R$ {product.price.toFixed(2)}</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="py-1 px-2 bg-gray-800 rounded">
                  Editar
                </button>
                <button onClick={() => handleDelete(product._id)} className="py-1 px-2 bg-gray-800 rounded">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
