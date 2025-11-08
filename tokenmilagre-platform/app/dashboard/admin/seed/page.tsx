'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Erro ao executar seed');
      }
    } catch (err) {
      setError('Erro de conexão ao executar seed');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Verificar se está autenticado
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  if (session.user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Acesso Negado</h1>
          <p className="text-gray-400">Apenas administradores podem acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Popular Banco de Dados</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Seed Database</h2>
          <p className="text-gray-300 mb-4">
            Esta ação irá popular o banco de dados com artigos de exemplo (notícias e educacionais).
          </p>

          <div className="bg-yellow-900/30 border border-yellow-500 rounded p-4 mb-4">
            <p className="text-yellow-300 text-sm">
              <strong>Atenção:</strong> O seed só funcionará se o banco de dados estiver vazio (sem artigos).
              Caso já existam artigos, a operação será cancelada para evitar duplicação.
            </p>
          </div>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Executando Seed...' : 'Executar Seed'}
          </button>
        </div>

        {/* Resultado de sucesso */}
        {result && (
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-400 mb-4">✅ Seed executado com sucesso!</h3>
            <div className="text-gray-300">
              <p className="mb-2"><strong>Mensagem:</strong> {result.message}</p>
              {result.data && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Artigos criados:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Notícias: {result.data.news}</li>
                    <li>Educacionais: {result.data.educational}</li>
                    <li>Total: {result.data.total}</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-4">
              <a
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Ver Homepage
              </a>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-red-400 mb-2">❌ Erro</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">O que será criado?</h3>
          <div className="text-gray-300 space-y-3">
            <div>
              <h4 className="font-semibold text-white mb-1">Artigos de Notícias (4):</h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Bitcoin atinge novo recorde histórico</li>
                <li>Ethereum 2.0: Nova atualização</li>
                <li>Regulamentação cripto em discussão</li>
                <li>Solana supera Ethereum em transações</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-1">Artigos Educacionais (4):</h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>O que é Bitcoin? - Iniciante</li>
                <li>Como funciona uma carteira - Iniciante</li>
                <li>DeFi explicado - Intermediário</li>
                <li>Análise técnica avançada - Avançado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
