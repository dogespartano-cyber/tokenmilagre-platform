'use client';

import { useState } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

  const connectWallet = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).solana && (window as any).solana.isPhantom) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (window as any).solana.connect();
        setWalletAddress(response.publicKey.toString());
        await checkTokenBalance(response.publicKey.toString());
      } else {
        alert('Por favor, instale a carteira Phantom: https://phantom.app/');
      }
    } catch (err) {
      console.error('Erro ao conectar:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkTokenBalance = async (address: string) => {
    try {
      // Importa Connection e PublicKey do Solana
      const { Connection, PublicKey } = await import('@solana/web3.js');

      // Conecta à rede Solana Mainnet
      const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

      // Converte endereços para PublicKey
      const walletPublicKey = new PublicKey(address);
      const tokenMintAddress = new PublicKey(TOKEN_ADDRESS);

      // Busca todas as contas de token associadas à carteira
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        { mint: tokenMintAddress }
      );

      if (tokenAccounts.value.length > 0) {
        // Pega o saldo da primeira conta encontrada
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        setTokenBalance(balance || 0);
      } else {
        // Nenhuma conta encontrada = saldo zero
        setTokenBalance(0);
      }
    } catch (error) {
      console.error('Erro ao buscar saldo:', error);
      setTokenBalance(0);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setTokenBalance(0);
  };

  const getTier = (balance: number) => {
    if (balance >= 50000) return { name: 'Anjo Guardião', color: 'text-yellow-400', benefits: 'Acesso total + Badge exclusivo' };
    if (balance >= 10000) return { name: 'Guardião', color: 'text-blue-400', benefits: 'Grupos privados + Mentorias' };
    if (balance >= 1000) return { name: 'Apoiador', color: 'text-green-400', benefits: 'Acesso à plataforma' };
    return { name: 'Visitante', color: 'text-gray-400', benefits: 'Compre $MILAGRE para começar' };
  };

  const tier = getTier(tokenBalance);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🌟</div>
          <h1 className="text-3xl font-bold text-white">$MILAGRE</h1>
        </div>

        <div className="flex gap-4">
          <a href="https://twitter.com" target="_blank" className="text-white hover:text-yellow-300 transition">
            𝕏
          </a>
          <a href="https://t.me" target="_blank" className="text-white hover:text-yellow-300 transition">
            ✈️
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-8xl mb-6">👼</div>
          <h2 className="text-5xl font-bold text-white mb-4">
            Nunca Estarás Sozinho
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Nos momentos mais difíceis, $MILAGRE surge como um farol de esperança.
            Juntos, criamos novas chances para um novo começo.
          </p>

          {!walletAddress ? (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-12 py-4 rounded-full transition shadow-2xl disabled:opacity-50"
            >
              {loading ? 'Conectando...' : 'Conectar Carteira'}
            </button>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <div className="mb-4">
                <p className="text-white/70 text-sm mb-1">Sua carteira:</p>
                <p className="text-white font-mono text-sm">
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-white/70 text-sm mb-1">Seu saldo:</p>
                <p className="text-3xl font-bold text-white">{tokenBalance.toLocaleString()} $MILAGRE</p>
              </div>

              <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-white/70 mb-1">Seu nível:</p>
                <p className={`text-2xl font-bold ${tier.color}`}>{tier.name}</p>
                <p className="text-sm text-white/80 mt-2">{tier.benefits}</p>
              </div>

              <button
                onClick={disconnectWallet}
                className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-2 rounded-lg transition"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-white mb-3">Escudo Dourado</h3>
            <p className="text-white/80">
              Simboliza o compromisso coletivo de proteger e fortalecer uns aos outros,
              criando uma base sólida de confiança e apoio mútuo.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-5xl mb-4">👑</div>
            <h3 className="text-2xl font-bold text-white mb-3">Cetro Dourado</h3>
            <p className="text-white/80">
              Empunhado com elegância e determinação, representa justiça e igualdade.
              É um lembrete de que o poder deve ser guiado pela sabedoria.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-white mb-3">Comunidade Unida</h3>
            <p className="text-white/80">
              Nossa comunidade é unida pelo propósito de superar desafios e apoiar uns aos outros.
              Aqui, você nunca estará sozinho.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Por que investir em $MILAGRE?
          </h3>
          <p className="text-white/90 text-lg max-w-3xl mx-auto mb-8">
            $MILAGRE é construído sobre colaboração e confiança. Aqui, você nunca está sozinho.
            Nossa comunidade está unida pelo propósito de superar desafios e apoiar uns aos outros.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-8 py-4 rounded-full transition shadow-xl"
            >
              🚀 Comprar $MILAGRE
            </a>
            <a
              href="https://t.me/tokenmilagre"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg px-8 py-4 rounded-full transition shadow-xl"
            >
              💬 Entrar na Comunidade
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-white/20">
        <div className="text-center text-white/60 text-sm">
          <p className="mb-2">
            $MILAGRE é um token comunitário criado para conectar pessoas através de apoio mútuo e esperança.
          </p>
          <p>© 2025 by $MILAGRE. Todos os direitos reservados!</p>
        </div>
      </footer>
    </div>
  );
}
