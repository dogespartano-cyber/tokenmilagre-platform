'use client';

import { useState, useEffect } from 'react';

export function SignManifesto() {
  const [signed, setSigned] = useState(false);
  const [signing, setSigning] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signersCount, setSignersCount] = useState(0);

  // Mock contador de signatários (em produção, seria on-chain)
  useEffect(() => {
    const mockCount = 147; // Contador mockup
    const savedCount = localStorage.getItem('manifesto_signers_count');
    if (savedCount) {
      setSignersCount(parseInt(savedCount));
    } else {
      setSignersCount(mockCount);
      localStorage.setItem('manifesto_signers_count', mockCount.toString());
    }
  }, []);

  const handleSign = async () => {
    setSigning(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).solana && (window as any).solana.isPhantom) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (window as any).solana.connect();
        const address = response.publicKey.toString();
        setWalletAddress(address);

        // Mock signature - em produção, seria uma transação on-chain
        // ou assinatura de mensagem verificável
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSigned(true);

        // Salvar no localStorage (mock - em produção seria on-chain)
        localStorage.setItem('manifesto_signed', 'true');
        localStorage.setItem('manifesto_signer', address);

        // Incrementar contador
        const newCount = signersCount + 1;
        setSignersCount(newCount);
        localStorage.setItem('manifesto_signers_count', newCount.toString());
      } else {
        alert('Por favor, instale a carteira Phantom: https://phantom.app/');
      }
    } catch (err) {
      console.error('Erro ao assinar:', err);
      alert('Erro ao conectar carteira. Tente novamente.');
    } finally {
      setSigning(false);
    }
  };

  // Check if already signed on mount
  if (typeof window !== 'undefined') {
    const alreadySigned = localStorage.getItem('manifesto_signed');
    const signer = localStorage.getItem('manifesto_signer');
    if (alreadySigned && !signed) {
      setSigned(true);
      setWalletAddress(signer);
    }
  }

  if (signed) {
    return (
      <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-xl rounded-2xl p-8 border-2 border-green-300/40 shadow-xl mb-8">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-poppins)]">
            Você Assinou o Manifesto!
          </h3>
          <p className="text-white/90 mb-4">
            Obrigado por se juntar ao movimento $MILAGRE
          </p>
          {walletAddress && (
            <p className="text-white/70 text-sm font-mono">
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </p>
          )}
          <div className="mt-6 inline-block bg-white/10 rounded-xl p-4">
            <p className="text-white/80 text-sm">
              🎉 Você agora faz parte da comunidade de signatários do manifesto!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 backdrop-blur-xl rounded-2xl p-8 border-2 border-yellow-300/40 shadow-xl mb-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-poppins)]">
          ✍️ Assine o Manifesto
        </h3>
        <p className="text-white/95 mb-4 max-w-2xl mx-auto">
          Ao assinar este manifesto com sua wallet, você demonstra seu compromisso com os valores
          de transparência, colaboração e apoio mútuo que definem o $MILAGRE.
        </p>

        {/* Contador de Signatários */}
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
          <p className="text-white/90 text-sm">
            <span className="font-bold text-yellow-200 text-lg">{signersCount}</span> {signersCount === 1 ? 'pessoa assinou' : 'pessoas assinaram'}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSign}
            disabled={signing}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-bold text-lg rounded-full transition-all shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                <span>Conectando...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>🔗</span>
                <span>Assinar com Phantom</span>
              </span>
            )}
          </button>
          <p className="text-white/70 text-sm">
            💡 A assinatura é feita através da sua wallet Phantom
          </p>
        </div>
      </div>
    </div>
  );
}
