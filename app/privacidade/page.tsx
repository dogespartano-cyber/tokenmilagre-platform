import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faCookieBite, faServer, faLock } from '@fortawesome/free-solid-svg-icons';

export default function PrivacyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
      <div className="mb-12 text-center">
<h1 className="title-newtab text-4xl mb-4 font-inter">Política de Privacidade</h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="space-y-8 glass-card p-8 rounded-2xl">
        <section className="space-y-4">
          <p className="text-[var(--text-secondary)] leading-relaxed">
            O projeto $MILAGRE valoriza sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações ao usar nossa plataforma. Estamos comprometidos em garantir que sua privacidade seja protegida.
          </p>
        </section>

        <section className="space-y-4">
<h2 className="title-newtab text-2xl">
            1. Coleta de Dados
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Atualmente, o projeto $MILAGRE opera de forma descentralizada e minimiza a coleta de dados pessoais. Podemos coletar:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)] ml-4">
            <li>Dados de uso anônimos para análise de desempenho do site.</li>
            <li>Informações públicas da blockchain quando você interage com nossos contratos inteligentes (se aplicável).</li>
            <li>Preferências de interface (como tema claro/escuro) armazenadas localmente no seu dispositivo.</li>
          </ul>
        </section>

        <section className="space-y-4">
<h2 className="title-newtab text-2xl">
            2. Cookies e Armazenamento Local
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Utilizamos cookies e armazenamento local (Local Storage) para melhorar sua experiência de navegação. Isso inclui:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)] ml-4">
            <li>Manter suas preferências de tema (Dark/Light Mode).</li>
            <li>Otimizar o carregamento de dados de mercado (Cache).</li>
            <li>Analisar o tráfego do site para melhorias de performance.</li>
          </ul>
          <p className="text-[var(--text-secondary)] mt-2">
            Você pode optar por desativar os cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.
          </p>
        </section>

        <section className="space-y-4">
<h2 className="title-newtab text-2xl">
            3. Segurança
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Estamos empenhados em garantir que suas informações estejam seguras. Implementamos procedimentos físicos, eletrônicos e administrativos adequados para proteger e proteger as informações que coletamos online.
          </p>
        </section>

        <section className="space-y-4">
<h2 className="title-newtab text-2xl">4. Serviços de Terceiros</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Nossa plataforma utiliza APIs e serviços de terceiros (como TradingView, CoinGecko, etc.) para fornecer dados de mercado. Esses serviços podem ter suas próprias políticas de privacidade e coleta de dados. Recomendamos que você revise as políticas desses provedores.
          </p>
        </section>

        <section className="space-y-4">
<h2 className="title-newtab text-2xl">5. Seus Direitos de Privacidade</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            De acordo com as leis de proteção de dados aplicáveis (incluindo GDPR, LGPD e similares), você tem direito a acessar, corrigir e solicitar a exclusão de seus dados pessoais, caso venhamos a coletá-los. Como priorizamos o anonimato, na maioria dos casos, não detemos dados que possam identificá-lo pessoalmente.
          </p>
        </section>

        <div className="pt-8 border-t border-[var(--border-light)]">
          <p className="text-sm text-[var(--text-tertiary)] text-center">
            Para questões relacionadas à privacidade, entre em contato através dos nossos canais oficiais.
          </p>
        </div>
      </div>
    </div>
  );
}
