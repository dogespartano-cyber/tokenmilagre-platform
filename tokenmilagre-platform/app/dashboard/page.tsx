'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Connection } from '@solana/web3.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLink,
  faWallet,
  faCircleNotch,
  faHandshake,
  faShield,
  faUserAstronaut,
  faUserGraduate,
  faCode,
  faSignature,
  faMagnifyingGlass,
  faRocket,
  faPenNib,
  faTrophy,
  faChartSimple,
  faUnlink,
} from '@fortawesome/free-solid-svg-icons';

const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';
const RPC_URL = 'https://api.mainnet-beta.solana.com';

interface Badge {
  id: string;
  name: string;
  icon: typeof faSignature;
  description: string;
  earned: boolean;
}

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [solBalance, setsolBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const priceUSD = 0.00001; // Mock price

  // Badges mockup
  const badges: Badge[] = [
    { id: '1', name: 'Signatário', icon: faSignature, description: 'Assinou o manifesto', earned: false },
    { id: '2', name: 'Apoiador', icon: faHandshake, description: '1.000+ $MILAGRE', earned: false },
    { id: '3', name: 'Guardião', icon: faShield, description: '10.000+ $MILAGRE', earned: false },
    { id: '4', name: 'Anjo', icon: faUserAstronaut, description: '50.000+ $MILAGRE', earned: false },
    { id: '5', name: 'Mentor', icon: faUserGraduate, description: '10+ mentorias realizadas', earned: false },
    { id: '6', name: 'Contribuidor', icon: faCode, description: 'Código contribuído', earned: false },
  ];

  const connectWallet = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).solana || !(window as any).solana.isPhantom) {
        alert('Por favor, instale a carteira Phantom: https://phantom.app/');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (window as any).solana.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);

      // Fetch SOL balance
      const connection = new Connection(RPC_URL, 'confirmed');
      const balance = await connection.getBalance(response.publicKey);
      setsolBalance(balance / 1e9); // Convert lamports to SOL

      // Set token balance to 0 for new wallets (em produção, buscaria do contrato real)
      setTokenBalance(0);
    } catch (err) {
      console.error('Erro ao conectar:', err);
      // Only show alert if wallet connection was actually rejected
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any).code === 4001) {
        // User rejected the connection
        return;
      }
      alert('Erro ao conectar wallet. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setTokenBalance(0);
    setsolBalance(0);
  };

  const getTier = () => {
    if (tokenBalance >= 50000) return { name: 'Anjo Guardião', icon: faUserAstronaut, color: 'purple' };
    if (tokenBalance >= 10000) return { name: 'Guardião', icon: faShield, color: 'blue' };
    if (tokenBalance >= 1000) return { name: 'Apoiador', icon: faHandshake, color: 'green' };
    return { name: 'Visitante', icon: faHandshake, color: 'gray' };
  };

  const getNextTier = () => {
    if (tokenBalance >= 50000) return null;
    if (tokenBalance >= 10000) return { name: 'Anjo Guardião', required: 50000 };
    if (tokenBalance >= 1000) return { name: 'Guardião', required: 10000 };
    return { name: 'Apoiador', required: 1000 };
  };

  const tier = getTier();
  const nextTier = getNextTier();
  const progressPercent = nextTier ? (tokenBalance / nextTier.required) * 100 : 100;

  return (
    <div className="container mx-auto px-4 py-8">
        {!walletAddress ? (
          // Wallet Not Connected
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border-2 border-white/30 shadow-2xl text-center">
              <div className="text-6xl mb-6">
                <FontAwesomeIcon icon={faLink} className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-poppins)]">
                Conecte sua Wallet
              </h1>
              <p className="text-white/90 mb-8">
                Conecte sua carteira Phantom para acessar seu dashboard pessoal
              </p>
              <button
                onClick={connectWallet}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-bold text-lg rounded-full transition-all shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircleNotch} className="w-5 h-5 animate-spin" />
                    <span>Conectando...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faWallet} className="w-5 h-5" />
                    <span>Conectar Phantom</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          // Dashboard Content
          <div className="space-y-6">
            {/* Header com Wallet Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Wallet Conectada</p>
                  <p className="text-white font-mono text-lg">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-white border border-red-300/40 rounded-full transition-all flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faUnlink} className="w-4 h-4" />
                  Desconectar
                </button>
              </div>
            </div>

            {/* Portfolio Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Token Balance */}
              <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-300/40 shadow-xl">
                <p className="text-white/80 text-sm mb-2">$MILAGRE Balance</p>
                <p className="text-white font-bold text-3xl mb-1">
                  {tokenBalance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                </p>
                <p className="text-white/70 text-sm">
                  ≈ ${(tokenBalance * priceUSD).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              </div>

              {/* SOL Balance */}
              <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-purple-300/40 shadow-xl">
                <p className="text-white/80 text-sm mb-2">SOL Balance</p>
                <p className="text-white font-bold text-3xl mb-1">
                  {solBalance.toFixed(4)}
                </p>
                <p className="text-white/70 text-sm">
                  Solana
                </p>
              </div>

              {/* Current Tier */}
              <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-blue-300/40 shadow-xl">
                <p className="text-white/80 text-sm mb-2">Tier Atual</p>
                <p className="text-white font-bold text-3xl mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={tier.icon} className="w-10 h-10" />
                  <span>{tier.name}</span>
                </p>
                <p className="text-white/70 text-sm">
                  Status do holder
                </p>
              </div>
            </div>

            {/* Tier Progress */}
            {nextTier && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-bold text-lg">Progresso para {nextTier.name}</h3>
                  <p className="text-white/80 text-sm">
                    {tokenBalance.toLocaleString()} / {nextTier.required.toLocaleString()}
                  </p>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <p className="text-white/70 text-sm mt-2">
                  Faltam {(nextTier.required - tokenBalance).toLocaleString()} $MILAGRE
                </p>
              </div>
            )}

            {/* Badge Collection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
              <h3 className="text-white font-bold text-xl mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                <FontAwesomeIcon icon={faTrophy} className="w-6 h-6" />
                Coleção de Badges
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`${
                      badge.earned
                        ? 'bg-gradient-to-br from-yellow-400/30 to-amber-400/30 border-yellow-300/50'
                        : 'bg-white/5 border-white/20 opacity-50'
                    } backdrop-blur-sm rounded-xl p-4 border-2 text-center transition-all hover:scale-105`}
                    title={badge.description}
                  >
                    <div className="text-4xl mb-2">
                      <FontAwesomeIcon icon={badge.icon} className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white text-xs font-semibold">{badge.name}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-sm mt-4 text-center">
                💡 Ganhe badges ao contribuir com a comunidade
              </p>
            </div>

            {/* Histórico de Transações */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
              <h3 className="text-white font-bold text-xl mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                <FontAwesomeIcon icon={faChartSimple} className="w-6 h-6" />
                Histórico de Transações
              </h3>
              <div className="space-y-3">
                <div className="text-center py-8">
                  <p className="text-white/70 mb-4">
                    Visualize suas transações no blockchain
                  </p>
                  <a
                    href={`https://solscan.io/account/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-white border border-purple-300/40 rounded-full transition-all"
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
                    Ver Transações no Solscan
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg px-8 py-6 rounded-2xl transition-all shadow-xl hover:scale-105 text-center flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
                Comprar Mais $MILAGRE
              </Link>
              <Link
                href="/manifesto"
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-bold text-lg px-8 py-6 rounded-2xl transition-all shadow-xl hover:scale-105 text-center flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faPenNib} className="w-5 h-5" />
                Assinar Manifesto
              </Link>
            </div>
          </div>
        )}
      </div>
  );
}
