import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-gray-900 rounded-lg border border-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Inventario App</h1>
          <p className="text-gray-400">Gestão de inventário inteligente e eficaz</p>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href="/login"
            className="block w-full text-center py-2 rounded border border-gray-700 text-white bg-gray-800"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="block w-full text-center py-2 rounded border border-gray-700 text-gray-300 bg-transparent"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
}
