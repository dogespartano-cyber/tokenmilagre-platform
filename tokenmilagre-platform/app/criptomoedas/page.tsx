'use client';

import CustomCryptoScreener from '@/components/CustomCryptoScreener';

export default function CriptomoedasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Rastreador de Mercado */}
      <div className="space-y-8">
        <div
          className="rounded-2xl overflow-hidden shadow-lg border"
          style={{
            borderColor: 'var(--border-light)',
            backgroundColor: 'var(--bg-elevated)',
          }}
        >
          <CustomCryptoScreener />
        </div>

        {/* Informações Adicionais */}
        <div
          className="rounded-2xl p-6 border shadow-md"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-light)',
          }}
        >
          <h2
            className="text-2xl font-bold mb-4 font-[family-name:var(--font-poppins)]"
            style={{ color: 'var(--text-primary)' }}
          >
            Sobre o Rastreador de Mercado
          </h2>
          <div className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Acompanhe as principais criptomoedas do mercado em tempo real. O rastreador exibe
              informações essenciais como preço, capitalização de mercado, volume de negociação e
              variação percentual.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Dados atualizados em tempo real</li>
              <li>Visualização completa do market cap e volume</li>
              <li>Gráficos de 7 dias para análise rápida</li>
              <li>Ordenação e filtragem personalizável</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
