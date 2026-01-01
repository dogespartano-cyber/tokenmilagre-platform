'use client';

import PageWrapper from '@/components/layout/PageWrapper';
import { Shield, BookOpen, Heart, Eye, Users, Globe, Scale, Sparkles, Target, TrendingUp, GraduationCap, Leaf, Coins, Quote } from 'lucide-react';

const pageHeader = {
  title: 'Manifesto $MILAGRE',
  description: 'Acreditamos que o conhecimento deve ser livre, mas a integridade deve ser protegida. Este é o nosso compromisso com a transparência e a prosperidade real.',
  shortTitle: 'Manifesto'
};

export default function ManifestoPage() {
  return (
    <PageWrapper header={pageHeader}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 space-y-20">

        {/* Mantra Visual - Redesigned */}
        <div className="relative p-10 md:p-14 rounded-3xl overflow-hidden group">
          {/* Background with Gradient and Blur */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-primary)] opacity-80 backdrop-blur-2xl" />
          <div className="absolute inset-0 border border-[var(--border-light)] rounded-3xl" />

          {/* Accent Line (Left) */}
          <div className="absolute left-0 top-10 bottom-10 w-1 bg-gradient-to-b from-teal-500 via-emerald-500 to-cyan-500 rounded-r-full opacity-80" />

          {/* Decorative Quote Icon (Watermark) */}
          <div className="absolute -top-4 -right-4 opacity-[0.03] transform rotate-12 transition-transform group-hover:rotate-0 duration-700">
            <Quote className="w-48 h-48" />
          </div>

          <div className="relative z-10 pl-6 md:pl-8">
            <div className="flex items-center gap-3 mb-6 text-emerald-500">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">Mantra $MILAGRE</span>
            </div>

            <blockquote className="text-2xl md:text-4xl font-serif leading-relaxed text-[var(--text-primary)]">
              &ldquo;Ensinar a construir <span className="text-teal-500 selection:bg-teal-500/20">patrimônio</span>, <br className="hidden md:block" />
              não a jogar na <span className="text-rose-400 selection:bg-rose-500/20" style={{ color: '#fb7185' }}>loteria</span>.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
            <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="title-newtab text-xl mb-3">Propósito Divino</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Nossa missão transcende o lucro. Somos um farol de esperança guiando as pessoas para longe da ganância e em direção à mordomia fiel dos recursos.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="title-newtab text-xl mb-3">Conhecimento Livre</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Todo o nosso material educacional é licenciado sob <strong>Creative Commons (CC-BY-SA)</strong>. O saber não pertence a ninguém, ele flui livremente para quem busca.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="title-newtab text-xl mb-3">Proteção Ativa</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Nosso código é 100% aberto sob licença <strong>MIT</strong>. Quando você vê a marca $MILAGRE, sabe que está em um porto seguro e auditável.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
            <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="title-newtab text-xl mb-3">Comunidade Horizontal</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Não há &quot;VIPs&quot; ou &quot;Insiders&quot;. Todos somos Testemunhas. O conhecimento e as oportunidades são distribuídos igualmente.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="title-newtab text-xl mb-3">Descentralização Real</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Acreditamos na soberania do indivíduo. Ensinamos auto-custódia e DeFi para que você nunca dependa de terceiros para gerir seu patrimônio.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Scale className="w-7 h-7" />
            </div>
            <h3 className="title-newtab text-xl mb-3">Justiça Econômica</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Combatemos a cultura de &quot;Pump and Dump&quot;. Construímos valor sustentável através de utilidade real e educação contínua.
            </p>
          </div>
        </div>

        {/* Filosofia de Prosperidade */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-xl space-y-8 shadow-sm relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Coins className="w-64 h-64 " />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="title-newtab text-3xl md:text-4xl">Filosofia de Prosperidade</h2>
            </div>
            <p className="text-lg text-[var(--text-secondary)]">
              Acreditamos em <span className=" font-bold">riqueza construída com fundamentos, paciência e ética</span>!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            <div className="p-5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)] hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5 " />
                <h4 className="font-bold text-[var(--text-primary)]">Enriquecer com verdade</h4>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Dinheiro sim, mas sem mentiras</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)] hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-5 h-5 " />
                <h4 className="font-bold text-[var(--text-primary)]">Prosperidade com propósito</h4>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Riqueza como meio, não fim</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)] hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 " />
                <h4 className="font-bold text-[var(--text-primary)]">Patrimônio, não pirâmides</h4>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Contra esquemas, pró fundamentos</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)] hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 " />
                <h4 className="font-bold text-[var(--text-primary)]">Servir bem, lucrar junto</h4>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">O lucro vem como consequência</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)] hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="w-5 h-5 " />
                <h4 className="font-bold text-[var(--text-primary)]">Educar para prosperar</h4>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Conhecimento que gera riqueza real</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)] hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="w-5 h-5 " />
                <h4 className="font-bold text-[var(--text-primary)]">Riqueza sustentável</h4>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Longo prazo &gt; pump and dump</p>
            </div>
          </div>
        </div>

        {/* Transparência Section */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-xl space-y-10 shadow-sm relative overflow-hidden text-left">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Eye className="w-64 h-64 " />
          </div>

          <div className="space-y-6 relative z-10">
            <h2 className="title-newtab text-3xl md:text-4xl">Transparência: Nossa Filosofia</h2>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-3xl">
              Em um mercado cheio de projetos secretos e promessas vazias, escolhemos o caminho oposto:
              <span className=" font-bold"> abertura total</span>.
              Nosso código, nossas decisões e nossas finanças são públicas. Não temos nada a esconder.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-6 p-6 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)]">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="title-newtab text-xl">100% Open Source</h3>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Todo o código fonte está no GitHub para qualquer pessoa auditar. Contratos inteligentes, plataforma, tudo. Sem backdoors, sem taxas ocultas, sem surpresas. <br /><br /><strong>A verdade não teme a luz.</strong>
              </p>
            </div>

            <div className="space-y-6 p-6 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)]">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="title-newtab text-xl">Licença MIT - Liberdade Total</h3>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Usamos a licença <strong>MIT</strong>, uma das mais permissivas do mundo. Qualquer pessoa pode estudar, modificar, usar comercialmente ou criar projetos derivados. <br /><br /><strong>Acreditamos que o conhecimento livre gera mais valor do que muros.</strong>
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border-light)] relative z-10">
            <p className="text-left text-[var(--text-tertiary)] italic text-lg font-serif">
              &quot;Conhecereis a verdade, e a verdade vos libertará.&quot; — João 8:32
            </p>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
