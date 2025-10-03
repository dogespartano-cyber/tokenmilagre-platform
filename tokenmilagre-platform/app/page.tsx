'use client';

import { useState } from 'react';
import Image from 'next/image';

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
      const { Connection, PublicKey } = await import('@solana/web3.js');
      const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
      const walletPublicKey = new PublicKey(address);
      const tokenMintAddress = new PublicKey(TOKEN_ADDRESS);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        { mint: tokenMintAddress }
      );

      if (tokenAccounts.value.length > 0) {
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        setTokenBalance(balance || 0);
      } else {
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
    if (balance >= 50000) return { name: 'Anjo Guardião', color: 'text-yellow-400', emoji: '👼', benefits: 'Acesso total + Badge exclusivo' };
    if (balance >= 10000) return { name: 'Guardião', color: 'text-blue-300', emoji: '🛡️', benefits: 'Grupos privados + Mentorias' };
    if (balance >= 1000) return { name: 'Apoiador', color: 'text-teal-300', emoji: '🤝', benefits: 'Acesso à plataforma' };
    return { name: 'Visitante', color: 'text-gray-300', emoji: '✨', benefits: 'Compre $MILAGRE para começar' };
  };

  const tier = getTier(tokenBalance);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5DD4D4] via-[#4DB8D8] to-[#E8F4F4]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">$MILAGRE</h1>
        </div>

        <div className="flex gap-6 items-center">
          <a href="https://twitter.com" target="_blank" className="text-white hover:text-yellow-300 transition text-2xl drop-shadow">
            𝕏
          </a>
          <a href="https://t.me/tokenmilagre" target="_blank" className="text-white hover:text-yellow-300 transition text-2xl drop-shadow">
            ✈️
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-xl">
              Nunca Estarás Sozinho 👼
            </h2>
            <p className="text-xl text-white/95 mb-8 leading-relaxed">
              Nos momentos mais difíceis, <span className="font-bold text-yellow-300">$MILAGRE</span> surge como um farol de esperança.
              Juntos, criamos novas chances para um novo começo.
            </p>

            {!walletAddress ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 font-bold text-xl px-12 py-5 rounded-full transition-all shadow-2xl disabled:opacity-50 transform hover:scale-105"
              >
                {loading ? 'Conectando...' : '🔗 Conectar Carteira'}
              </button>
            ) : (
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
                <div className="mb-4">
                  <p className="text-white/80 text-sm mb-1">Sua carteira:</p>
                  <p className="text-white font-mono text-base font-semibold">
                    {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-white/80 text-sm mb-1">Seu saldo:</p>
                  <p className="text-4xl font-bold text-white drop-shadow-lg">{tokenBalance.toLocaleString()} $MILAGRE</p>
                </div>

                <div className="mb-6 p-4 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-2xl border border-yellow-300/30">
                  <p className="text-sm text-white/80 mb-2">Seu nível:</p>
                  <p className={`text-3xl font-bold ${tier.color} drop-shadow-lg`}>
                    {tier.emoji} {tier.name}
                  </p>
                  <p className="text-sm text-white/90 mt-2">{tier.benefits}</p>
                </div>

                <button
                  onClick={disconnectWallet}
                  className="w-full bg-red-500/80 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Desconectar
                </button>
              </div>
            )}
          </div>

          {/* Right - Hero Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-yellow-300/30 blur-3xl rounded-full"></div>
              <Image
                src="/images/TOKEN-MILAGRE-.webp"
                alt="Anjo do Milagre"
                width={500}
                height={500}
                className="relative z-10 drop-shadow-2xl animate-pulse-slow rounded-3xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Guardiões Detalhados */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
            Nossos Guardiões Celestiais ✨
          </h3>
          <p className="text-white/90 text-center text-lg mb-12 max-w-3xl mx-auto">
            Cada guardião representa um pilar fundamental da nossa comunidade, guiando holders em sua jornada de prosperidade e crescimento.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Guardiã da Prosperidade */}
            <div className="group bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-yellow-300/50 transition-all duration-300 overflow-hidden border border-yellow-300/30">
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-100">
                <Image
                  src="/images/Token-MILAGRE-1.webp"
                  alt="Guardiã da Prosperidade"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-block px-3 py-1 bg-yellow-400 rounded-full mb-2">
                    <span className="text-sm font-bold text-gray-900">👼 Prosperidade</span>
                  </div>
                  <h4 className="text-white font-bold text-xl">Guardiã da Prosperidade</h4>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  <span className="font-bold text-yellow-600">Proteção Financeira:</span> Orienta holders em decisões de investimento sábias e sustentáveis.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-yellow-500 mt-0.5">✓</span>
                    <span>Alertas de oportunidades</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-yellow-500 mt-0.5">✓</span>
                    <span>Educação financeira</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-yellow-500 mt-0.5">✓</span>
                    <span>Recompensas long-term</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guardião da Sabedoria */}
            <div className="group bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-blue-300/50 transition-all duration-300 overflow-hidden border border-blue-300/30">
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-100">
                <Image
                  src="/images/Token-MILAGRE-2.webp"
                  alt="Guardião da Sabedoria"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-block px-3 py-1 bg-blue-400 rounded-full mb-2">
                    <span className="text-sm font-bold text-white">🧙 Sabedoria</span>
                  </div>
                  <h4 className="text-white font-bold text-xl">Guardião da Sabedoria</h4>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  <span className="font-bold text-blue-600">Conhecimento Compartilhado:</span> Cultiva uma comunidade de aprendizado contínuo e mentoria.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Workshops blockchain & DeFi</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Mentorias especializadas</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Biblioteca educacional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Anjo da Esperança */}
            <div className="group bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 overflow-hidden border border-purple-300/30">
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100">
                <Image
                  src="/images/Token-MILAGRE-7.webp"
                  alt="Anjo da Esperança"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-block px-3 py-1 bg-purple-400 rounded-full mb-2">
                    <span className="text-sm font-bold text-white">💫 Esperança</span>
                  </div>
                  <h4 className="text-white font-bold text-xl">Anjo da Esperança</h4>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  <span className="font-bold text-purple-600">Apoio Emocional:</span> Oferece suporte e motivação em momentos de incerteza.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Grupos de apoio emocional</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Histórias de superação</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Ajuda mútua 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial de Compra */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
            Como Comprar $MILAGRE 🚀
          </h3>
          <p className="text-white/90 text-center text-lg mb-10 max-w-2xl mx-auto">
            Siga este guia passo a passo para adquirir seus tokens e se juntar à nossa comunidade.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Passo 1 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/30 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3 text-center">Instale a Phantom</h4>
              <p className="text-white/85 text-sm text-center leading-relaxed">
                Baixe a carteira <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">Phantom</a> (extensão do navegador ou app mobile).
              </p>
            </div>

            {/* Passo 2 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/30 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3 text-center">Compre Solana (SOL)</h4>
              <p className="text-white/85 text-sm text-center leading-relaxed">
                Adquira SOL em exchanges como Binance, Coinbase ou diretamente na Phantom com cartão.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/30 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3 text-center">Acesse Pump.fun</h4>
              <p className="text-white/85 text-sm text-center leading-relaxed">
                Visite <a href={`https://pump.fun/coin/${TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">pump.fun</a> e conecte sua Phantom Wallet.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/30 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-3xl font-bold text-white">4</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3 text-center">Troque por $MILAGRE</h4>
              <p className="text-white/85 text-sm text-center leading-relaxed">
                Insira a quantidade de SOL, confirme a transação e receba seus $MILAGRE!
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold text-xl px-12 py-5 rounded-full transition-all shadow-2xl transform hover:scale-105"
            >
              🚀 Comprar Agora no Pump.fun
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 backdrop-blur-lg rounded-3xl p-12 border-2 border-yellow-300/50 shadow-2xl text-center">
          <h3 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
            Por que investir em $MILAGRE?
          </h3>
          <p className="text-white/95 text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            $MILAGRE é construído sobre colaboração e confiança. Aqui, você nunca está sozinho.
            Nossa comunidade está unida pelo propósito de superar desafios e apoiar uns aos outros.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-3">🛡️</div>
              <h4 className="text-white font-bold text-lg mb-2">Comunidade Real</h4>
              <p className="text-white/80 text-sm">Apoio mútuo e crescimento conjunto</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-3">📈</div>
              <h4 className="text-white font-bold text-lg mb-2">Utilidade Genuína</h4>
              <p className="text-white/80 text-sm">Acesso a mentorias e recursos exclusivos</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-3">💎</div>
              <h4 className="text-white font-bold text-lg mb-2">Transparência Total</h4>
              <p className="text-white/80 text-sm">Sem promessas vazias, apenas ação real</p>
            </div>
          </div>

          <div className="flex gap-6 justify-center flex-wrap">
            <a
              href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold text-xl px-10 py-5 rounded-full transition-all shadow-xl transform hover:scale-105"
            >
              🚀 Comprar $MILAGRE
            </a>
            <a
              href="https://t.me/tokenmilagre"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-xl px-10 py-5 rounded-full transition-all shadow-xl transform hover:scale-105"
            >
              💬 Entrar na Comunidade
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t-2 border-white/30">
        <div className="text-center text-white/80">
          <p className="mb-3 text-lg">
            $MILAGRE é um token comunitário criado para conectar pessoas através de apoio mútuo e esperança.
          </p>
          <p className="text-sm">© 2025 by $MILAGRE. Todos os direitos reservados!</p>
        </div>
      </footer>
    </div>
  );
}
