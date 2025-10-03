'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

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
      {/* Navigation Menu - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#4DB8D8]/95 to-[#5DD4D4]/95 backdrop-blur-lg border-b-2 border-white/20 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <button onClick={() => scrollToSection('home')} className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">✨</span>
              </div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">$MILAGRE</h1>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('sobre')} className="text-white hover:text-yellow-300 transition font-semibold">
                O que é?
              </button>
              <button onClick={() => scrollToSection('guardioes')} className="text-white hover:text-yellow-300 transition font-semibold">
                Guardiões
              </button>
              <button onClick={() => scrollToSection('comprar')} className="text-white hover:text-yellow-300 transition font-semibold">
                Como Comprar
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-white hover:text-yellow-300 transition font-semibold">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contato')} className="text-white hover:text-yellow-300 transition font-semibold">
                Sobre
              </button>

              {/* Social Icons */}
              <div className="flex gap-4 items-center ml-4 pl-4 border-l-2 border-white/30">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition text-xl">
                  𝕏
                </a>
                <a href="https://t.me/tokenmilagre" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition text-xl">
                  ✈️
                </a>
              </div>

              {/* CTA Button */}
              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-full transition-all shadow-lg transform hover:scale-105"
              >
                🚀 Comprar
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white text-3xl focus:outline-none"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 space-y-3">
              <button onClick={() => scrollToSection('sobre')} className="block w-full text-left text-white hover:text-yellow-300 transition font-semibold py-2">
                O que é?
              </button>
              <button onClick={() => scrollToSection('guardioes')} className="block w-full text-left text-white hover:text-yellow-300 transition font-semibold py-2">
                Guardiões
              </button>
              <button onClick={() => scrollToSection('comprar')} className="block w-full text-left text-white hover:text-yellow-300 transition font-semibold py-2">
                Como Comprar
              </button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left text-white hover:text-yellow-300 transition font-semibold py-2">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contato')} className="block w-full text-left text-white hover:text-yellow-300 transition font-semibold py-2">
                Sobre
              </button>

              <div className="flex gap-6 items-center pt-3 border-t border-white/20">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition text-2xl">
                  𝕏
                </a>
                <a href="https://t.me/tokenmilagre" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition text-2xl">
                  ✈️
                </a>
              </div>

              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-full transition-all shadow-lg mt-4"
              >
                🚀 Comprar Agora
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div id="home" className="grid lg:grid-cols-2 gap-12 items-center mb-20 scroll-mt-24">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-xl">
              Nunca Estarás Sozinho 👼
            </h2>
            <p className="text-xl text-white mb-8 leading-relaxed drop-shadow-md">
              Nos momentos mais difíceis, <span className="font-bold text-yellow-200">$MILAGRE</span> surge como um farol de esperança.
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
            <div className="relative w-full max-w-lg group">
              {/* Aura espiritual base */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-cyan-300/20 to-purple-300/20 blur-3xl rounded-full animate-pulse"></div>

              {/* Iluminação ao hover - Camadas múltiplas */}
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/0 via-yellow-400/0 to-white/0 blur-2xl rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-cyan-200/0 via-cyan-400/0 to-white/0 blur-2xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-1000 delay-100"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-200/0 via-purple-400/0 to-white/0 blur-2xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-1000 delay-200"></div>

              {/* Raios de luz */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-yellow-200/80 to-transparent blur-sm -translate-x-1/2 animate-pulse"></div>
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent blur-sm -translate-y-1/2 animate-pulse delay-150"></div>
              </div>

              {/* Partículas flutuantes */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full blur-sm animate-float"></div>
                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full blur-sm animate-float-delayed"></div>
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-300 rounded-full blur-sm animate-float-slow"></div>
                <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white rounded-full blur-sm animate-float"></div>
              </div>

              {/* Imagem com efeito de levitação */}
              <div className="relative z-10 transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-700">
                <Image
                  src="/images/TOKEN-MILAGRE-Hero.webp"
                  alt="Anjo Guardião do Milagre"
                  width={500}
                  height={500}
                  className="drop-shadow-2xl rounded-3xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* O que é $MILAGRE */}
        <div id="sobre" className="mb-20 scroll-mt-24">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border-2 border-white/30 shadow-2xl">
            <h3 className="text-4xl font-bold text-white text-center mb-6 drop-shadow-lg">
              O que é $MILAGRE? ✨
            </h3>
            <div className="max-w-4xl mx-auto space-y-6 text-white/95 text-lg leading-relaxed">
              <p className="text-center text-xl font-semibold text-yellow-300">
                Um token comunitário peer-to-peer criado na blockchain Solana para conectar pessoas através de apoio mútuo genuíno.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
                  <h4 className="text-2xl font-bold mb-4 text-yellow-200">🌐 Tecnologia Solana</h4>
                  <p className="text-white leading-relaxed">
                    Construído na blockchain Solana, $MILAGRE oferece transações rápidas, taxas baixas e segurança descentralizada.
                    Não é apenas um token - é uma ponte entre tecnologia e humanidade.
                  </p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
                  <h4 className="text-2xl font-bold mb-4 text-yellow-200">🤝 Apoio Mútuo Real</h4>
                  <p className="text-white leading-relaxed">
                    Diferente de outros tokens, $MILAGRE existe para criar valor humano real: mentorias, networking,
                    suporte emocional e oportunidades de crescimento pessoal e profissional.
                  </p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
                  <h4 className="text-2xl font-bold mb-4 text-yellow-200">👼 Guardiões Celestiais</h4>
                  <p className="text-white leading-relaxed">
                    Nossa comunidade é guiada por três pilares: Prosperidade (crescimento financeiro),
                    Sabedoria (educação contínua) e Esperança (apoio emocional). Cada holder tem acesso a esses guardiões.
                  </p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
                  <h4 className="text-2xl font-bold mb-4 text-yellow-200">🎯 Missão Clara</h4>
                  <p className="text-white leading-relaxed">
                    &quot;Nunca estarás sozinho&quot; não é só um slogan - é nosso compromisso. Criamos um ecossistema onde
                    holders se ajudam mutuamente a superar desafios e alcançar seus objetivos.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-2xl p-6 mt-8 border border-yellow-300/30">
                <p className="text-center font-semibold text-xl">
                  💡 <strong className="text-yellow-300">Do Only Good Everyday</strong> - Fazemos apenas o bem, todos os dias.
                  Cada transação fortalece nossa comunidade e expande nossa capacidade de ajudar uns aos outros.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Técnicas do Token */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-cyan-400/20 via-teal-400/20 to-emerald-400/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-cyan-300/40 shadow-2xl">
            <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
              Informações do Token 🪙
            </h3>
            <p className="text-white text-center text-lg mb-10 max-w-3xl mx-auto">
              $MILAGRE foi criado com as melhores tecnologias do ecossistema Solana
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
              {/* Card Pump.fun */}
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-cyan-200/40 hover:border-yellow-300/60 hover:bg-white/25 transition-all group shadow-lg hover:shadow-yellow-300/30">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-6 bg-gradient-to-br from-yellow-100/20 to-amber-100/20 rounded-2xl p-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex items-center justify-center border border-yellow-200/30">
                    <Image
                      src="/images/pumpfun-logo.png"
                      alt="Pump.fun"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3 drop-shadow">Criado na Pump.fun</h4>
                  <p className="text-white leading-relaxed mb-4">
                    Lançado na <strong className="text-yellow-200">Pump.fun</strong>, a plataforma líder para criação de tokens na Solana.
                    Garantia de liquidez e transparência total desde o primeiro dia.
                  </p>
                  <a
                    href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-gray-900 font-bold rounded-full transition-all shadow-lg hover:shadow-yellow-400/50 hover:scale-105"
                  >
                    <span>Ver na Pump.fun</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* Card Solana */}
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-cyan-200/40 hover:border-teal-300/60 hover:bg-white/25 transition-all group shadow-lg hover:shadow-teal-300/30">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-6 bg-gradient-to-br from-teal-100/20 to-cyan-100/20 rounded-2xl p-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 flex items-center justify-center border border-teal-200/30">
                    <Image
                      src="/images/solana-logo.png"
                      alt="Solana"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3 drop-shadow">Rede Solana</h4>
                  <p className="text-white leading-relaxed mb-4">
                    Construído na <strong className="text-teal-200">blockchain Solana</strong>, conhecida por suas transações ultra-rápidas
                    (menos de 1 segundo) e taxas extremamente baixas (centavos de dólar).
                  </p>
                  <a
                    href="https://solana.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-teal-400/50 hover:scale-105"
                  >
                    <span>Sobre Solana</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contrato e Stats */}
            <div className="bg-gradient-to-r from-white/15 to-cyan-100/15 backdrop-blur-lg rounded-2xl p-6 border-2 border-cyan-200/30 max-w-4xl mx-auto shadow-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center md:text-left">
                  <p className="text-cyan-100 text-sm mb-2 font-semibold">Endereço do Contrato</p>
                  <code className="text-yellow-100 font-mono text-xs md:text-sm break-all block bg-gradient-to-r from-teal-900/40 to-cyan-900/40 p-3 rounded-lg border border-cyan-300/20">
                    {TOKEN_ADDRESS}
                  </code>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-white/10 rounded-xl p-3 border border-cyan-200/20">
                    <p className="text-cyan-100 text-sm mb-1">Blockchain</p>
                    <p className="text-white font-bold text-lg">Solana</p>
                  </div>
                  <div className="text-center bg-white/10 rounded-xl p-3 border border-cyan-200/20">
                    <p className="text-cyan-100 text-sm mb-1">Tipo</p>
                    <p className="text-white font-bold text-lg">SPL Token</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guardiões Detalhados */}
        <div id="guardioes" className="mb-20 scroll-mt-24">
          <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
            Nossos Guardiões Celestiais ✨
          </h3>
          <p className="text-white/90 text-center text-lg mb-12 max-w-3xl mx-auto">
            Cada guardião representa um pilar fundamental da nossa comunidade, guiando holders em sua jornada de prosperidade e crescimento.
          </p>

          <div className="max-w-5xl mx-auto space-y-8">
            {/* Guardiã da Prosperidade */}
            <div className="group bg-white/15 backdrop-blur-xl rounded-3xl border-2 border-white/30 shadow-2xl hover:shadow-yellow-300/50 hover:bg-white/20 transition-all duration-300 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                {/* Imagem Circular */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 rounded-full blur-2xl"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-yellow-300/50 shadow-xl">
                    <Image
                      src="/images/Token-MILAGRE-1.webp"
                      alt="Guardiã da Prosperidade"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-4 py-2 bg-yellow-400/90 backdrop-blur-sm rounded-full mb-3 shadow-lg">
                    <span className="text-sm font-bold text-gray-900">👼 Prosperidade</span>
                  </div>
                  <h4 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">Guardiã da Prosperidade</h4>
                  <p className="text-white/95 mb-4 text-lg leading-relaxed">
                    <span className="font-bold text-yellow-200">Proteção Financeira:</span> Orienta holders em decisões de investimento sábias e sustentáveis.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30 rounded-full text-white text-sm">
                      ✓ Alertas de oportunidades
                    </span>
                    <span className="px-4 py-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30 rounded-full text-white text-sm">
                      ✓ Educação financeira
                    </span>
                    <span className="px-4 py-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30 rounded-full text-white text-sm">
                      ✓ Recompensas long-term
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guardião da Sabedoria */}
            <div className="group bg-white/15 backdrop-blur-xl rounded-3xl border-2 border-white/30 shadow-2xl hover:shadow-blue-300/50 hover:bg-white/20 transition-all duration-300 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                {/* Imagem Circular */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-600/30 rounded-full blur-2xl"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-blue-300/50 shadow-xl">
                    <Image
                      src="/images/Token-MILAGRE-2.webp"
                      alt="Guardião da Sabedoria"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-4 py-2 bg-blue-400/90 backdrop-blur-sm rounded-full mb-3 shadow-lg">
                    <span className="text-sm font-bold text-white">🧙 Sabedoria</span>
                  </div>
                  <h4 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">Guardião da Sabedoria</h4>
                  <p className="text-white/95 mb-4 text-lg leading-relaxed">
                    <span className="font-bold text-blue-200">Conhecimento Compartilhado:</span> Cultiva uma comunidade de aprendizado contínuo e mentoria.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-2 bg-blue-400/20 backdrop-blur-sm border border-blue-300/30 rounded-full text-white text-sm">
                      ✓ Workshops blockchain & DeFi
                    </span>
                    <span className="px-4 py-2 bg-blue-400/20 backdrop-blur-sm border border-blue-300/30 rounded-full text-white text-sm">
                      ✓ Mentorias especializadas
                    </span>
                    <span className="px-4 py-2 bg-blue-400/20 backdrop-blur-sm border border-blue-300/30 rounded-full text-white text-sm">
                      ✓ Biblioteca educacional
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Anjo da Esperança */}
            <div className="group bg-white/15 backdrop-blur-xl rounded-3xl border-2 border-white/30 shadow-2xl hover:shadow-purple-300/50 hover:bg-white/20 transition-all duration-300 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                {/* Imagem Circular */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-2xl"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-300/50 shadow-xl">
                    <Image
                      src="/images/Token-MILAGRE-7.webp"
                      alt="Anjo da Esperança"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-4 py-2 bg-purple-400/90 backdrop-blur-sm rounded-full mb-3 shadow-lg">
                    <span className="text-sm font-bold text-white">💫 Esperança</span>
                  </div>
                  <h4 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">Anjo da Esperança</h4>
                  <p className="text-white/95 mb-4 text-lg leading-relaxed">
                    <span className="font-bold text-purple-200">Apoio Emocional:</span> Oferece suporte e motivação em momentos de incerteza.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-2 bg-purple-400/20 backdrop-blur-sm border border-purple-300/30 rounded-full text-white text-sm">
                      ✓ Grupos de apoio emocional
                    </span>
                    <span className="px-4 py-2 bg-purple-400/20 backdrop-blur-sm border border-purple-300/30 rounded-full text-white text-sm">
                      ✓ Histórias de superação
                    </span>
                    <span className="px-4 py-2 bg-purple-400/20 backdrop-blur-sm border border-purple-300/30 rounded-full text-white text-sm">
                      ✓ Ajuda mútua 24/7
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial de Compra */}
        <div id="comprar" className="mb-20 scroll-mt-24">
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
        <div className="mb-20 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 backdrop-blur-lg rounded-3xl p-12 border-2 border-yellow-300/50 shadow-2xl text-center">
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

        {/* FAQ / Milagrépedia */}
        <div id="faq" className="mb-20 scroll-mt-24">
          <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
            Milagrépedia 📚
          </h3>
          <p className="text-white/90 text-center text-lg mb-12 max-w-3xl mx-auto">
            Perguntas frequentes sobre $MILAGRE e nossa comunidade
          </p>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
              <h4 className="text-xl font-bold text-yellow-300 mb-3">
                ❓ Por que $MILAGRE foi criado?
              </h4>
              <p className="text-white/90 leading-relaxed">
                $MILAGRE nasceu da necessidade de criar uma comunidade onde as pessoas realmente se apoiam.
                Muitos tokens prometem &quot;comunidade&quot;, mas poucos entregam valor humano real. Nós queremos mudar isso,
                oferecendo mentorias, networking e suporte emocional genuíno para todos os holders.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
              <h4 className="text-xl font-bold text-yellow-300 mb-3">
                🔒 $MILAGRE é seguro?
              </h4>
              <p className="text-white/90 leading-relaxed">
                Sim! $MILAGRE é um token SPL na blockchain Solana, uma das blockchains mais rápidas e seguras do mundo.
                Todas as transações são verificadas e registradas publicamente. Sempre use carteiras oficiais como Phantom
                e nunca compartilhe suas seed phrases com ninguém.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
              <h4 className="text-xl font-bold text-yellow-300 mb-3">
                🎯 Como funciona o sistema de guardiões?
              </h4>
              <p className="text-white/90 leading-relaxed">
                Os três guardiões (Prosperidade, Sabedoria e Esperança) representam os pilares da nossa comunidade.
                Dependendo da quantidade de $MILAGRE que você possui, você desbloqueia diferentes níveis de acesso:
                Apoiador (1.000+), Guardião (10.000+) e Anjo Guardião (50.000+). Cada nível oferece benefícios exclusivos.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
              <h4 className="text-xl font-bold text-yellow-300 mb-3">
                💰 Onde posso vender meus tokens?
              </h4>
              <p className="text-white/90 leading-relaxed">
                Você pode vender seus tokens $MILAGRE na mesma plataforma onde comprou (Pump.fun) ou em qualquer DEX
                da Solana que suporte o token. Basta conectar sua carteira e fazer a troca por SOL ou outros tokens.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
              <h4 className="text-xl font-bold text-yellow-300 mb-3">
                🚀 Qual é o roadmap do projeto?
              </h4>
              <p className="text-white/90 leading-relaxed">
                <strong className="text-yellow-300">Fase 1 (Atual):</strong> Landing page e integração blockchain ✅<br />
                <strong className="text-yellow-300">Fase 2:</strong> Dashboard de holders com estatísticas em tempo real<br />
                <strong className="text-yellow-300">Fase 3:</strong> Sistema de mentoria e fórum comunitário<br />
                <strong className="text-yellow-300">Fase 4:</strong> Governança on-chain e sistema de recompensas/staking
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
              <h4 className="text-xl font-bold text-yellow-300 mb-3">
                🌐 O que é Solana?
              </h4>
              <p className="text-white/90 leading-relaxed">
                Solana é uma blockchain de alta performance que processa milhares de transações por segundo com taxas
                extremamente baixas (centavos de dólar). É ideal para projetos que precisam de velocidade e eficiência,
                como $MILAGRE. Para aprender mais, visite <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">solana.com</a>.
              </p>
            </div>

            {/* FAQ Item 7 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition">
              <h4 className="text-xl font-bold text-yellow-300 mb-3">
                🛡️ Dicas de segurança para holders
              </h4>
              <p className="text-white/90 leading-relaxed">
                <strong>• Nunca compartilhe sua seed phrase</strong> (12-24 palavras de recuperação)<br />
                <strong>• Use apenas sites oficiais</strong> - verifique sempre o domínio<br />
                <strong>• Habilite autenticação 2FA</strong> em exchanges<br />
                <strong>• Desconfie de mensagens privadas</strong> - não pedimos informações por DM<br />
                <strong>• Faça backup da sua carteira</strong> em local seguro
              </p>
            </div>
          </div>
        </div>

        {/* Sobre o Projeto */}
        <div id="contato" className="mb-20 scroll-mt-24">
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-purple-300/30 shadow-2xl">
            <h3 className="text-4xl font-bold text-white text-center mb-6 drop-shadow-lg">
              Sobre o Projeto $MILAGRE 💫
            </h3>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <p className="text-white/95 text-xl leading-relaxed mb-6">
                  $MILAGRE é mais que um token - é um movimento de apoio mútuo genuíno na blockchain.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/10 rounded-2xl p-6">
                  <h4 className="text-2xl font-bold mb-4 text-purple-300">🎯 Nossa Missão</h4>
                  <p className="text-white/90 leading-relaxed">
                    Criar um ecossistema descentralizado onde holders se conectam, aprendem e crescem juntos.
                    Oferecemos mentorias, networking, educação financeira e suporte emocional para todos que
                    acreditam que juntos somos mais fortes.
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-6">
                  <h4 className="text-2xl font-bold mb-4 text-purple-300">💎 Nossos Valores</h4>
                  <p className="text-white/90 leading-relaxed">
                    <strong>Transparência:</strong> Sem promessas vazias<br />
                    <strong>Apoio Mútuo:</strong> Crescemos juntos<br />
                    <strong>Inclusão:</strong> Todos são bem-vindos<br />
                    <strong>Ação:</strong> Resultados reais, não apenas palavras
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-2xl p-8 border border-yellow-300/30 text-center">
                <p className="text-2xl font-bold text-yellow-300 mb-4">
                  &quot;Nunca estarás sozinho&quot;
                </p>
                <p className="text-white/90 text-lg">
                  Este é nosso compromisso com cada holder. Em momentos de dúvida, celebração ou desafio,
                  nossa comunidade estará sempre presente.
                </p>
              </div>

              <div className="text-center">
                <h4 className="text-2xl font-bold text-white mb-4">📊 Informações do Token</h4>
                <div className="bg-white/10 rounded-2xl p-6 inline-block">
                  <p className="text-white/80 text-sm mb-2">Endereço do Contrato:</p>
                  <code className="text-yellow-300 font-mono text-xs break-all">
                    {TOKEN_ADDRESS}
                  </code>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-white/80 text-sm">Blockchain: <strong className="text-white">Solana</strong></p>
                    <p className="text-white/80 text-sm">Tipo: <strong className="text-white">SPL Token</strong></p>
                  </div>
                </div>
              </div>
            </div>
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
