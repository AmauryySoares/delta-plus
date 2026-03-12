import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2">404</h2>
        <p className="text-gray-400 mb-6">Página não encontrada</p>
        <Link 
          href="/"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-block"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}