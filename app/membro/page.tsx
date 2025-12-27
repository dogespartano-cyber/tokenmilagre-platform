
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faBolt, faStar, faHistory, faBookmark, faGraduationCap, faWallet } from '@fortawesome/free-solid-svg-icons';
import MissionControl from '@/components/gamification/MissionControl';
import UserLevelWidget from '@/components/gamification/UserLevelWidget'; // Reusing visual logic, might need adaptation
import Image from 'next/image';

export const metadata = {
  title: 'Área do Membro | $MILAGRE',
  description: 'Seu painel pessoal de evolução e conquistas na comunidade.',
};

export default async function MemberDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HERO SECTION: Welcome & Quick Stats */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden border border-[var(--border-light)]">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-primary)]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

            {/* User Greeting */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-[var(--bg-page)] shadow-xl overflow-hidden relative z-10">
                  <Image
                    src={user?.imageUrl || '/images/default-avatar.png'}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTrophy} />
                  <span>Nível 5</span>
                </div>
              </div>

              <div className="text-center md:text-left">
<h1 className="title-newtab text-3xl">
                  Olá, {user?.firstName || 'Membro'}!
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Você é um <span className="font-bold text-[var(--brand-primary)]">Embaixador</span> da comunidade.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2">
                    <FontAwesomeIcon icon={faHistory} className="text-[var(--text-tertiary)]" />
                    Membro desde 2025
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2">
                    <FontAwesomeIcon icon={faWallet} className="text-[var(--text-tertiary)]" />
                    Carteira não conectada
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Widget (Large) */}
            <div className="flex gap-4">
              <div className="bg-[var(--bg-tertiary)]/50 p-4 rounded-2xl border border-[var(--border-light)] min-w-[140px] text-center">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Pontos de Milagre</div>
                <div className="text-2xl font-black text-[var(--brand-primary)] flex justify-center items-center gap-2">
                  <FontAwesomeIcon icon={faBolt} />
                  1.250
                </div>
              </div>
              <div className="bg-[var(--bg-tertiary)]/50 p-4 rounded-2xl border border-[var(--border-light)] min-w-[140px] text-center">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Cursos Concluídos</div>
                <div className="text-2xl font-black flex justify-center items-center gap-2">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  3
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Mission Control (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Daily Missions */}
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
<h2 className="title-newtab text-xl flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                  Missões Ativas
                </h2>
              </div>
              <MissionControl />
            </section>

            {/* Recent Activity / Content Recommendation */}
            <section>
<h2 className="title-newtab text-xl mb-4 px-2">Continuar Aprendendo</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Placeholder Card 1 */}
                <div className="glass-card p-4 rounded-xl border border-[var(--border-light)] hover:border-[var(--brand-primary)] transition-colors cursor-pointer group">
                  <div className="h-32 rounded-lg bg-[var(--bg-tertiary)] mb-3 relative overflow-hidden">
                    {/* Image Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-bold px-2 py-1 bg-[var(--brand-primary)] rounded-md">Segurança</span>
                    </div>
                  </div>
<h3 className="title-newtab text-lg mb-1 group-hover:text-[var(--brand-primary)] transition-colors">Como proteger sua carteira Phantom</h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">Aprenda as melhores práticas para evitar drenadores de carteira e manter seus ativos seguros.</p>
                </div>
                {/* Placeholder Card 2 */}
                <div className="glass-card p-4 rounded-xl border border-[var(--border-light)] hover:border-[var(--brand-primary)] transition-colors cursor-pointer group">
                  <div className="h-32 rounded-lg bg-[var(--bg-tertiary)] mb-3 relative overflow-hidden">
                    {/* Image Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-bold px-2 py-1 bg-purple-500 rounded-md">DeFi</span>
                    </div>
                  </div>
<h3 className="title-newtab text-lg mb-1 group-hover:text-[var(--brand-primary)] transition-colors">O que é Impermanent Loss?</h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">Entenda os riscos de prover liquidez em pools de AMM antes de investir.</p>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Sidebar Stats & Menu (1/3 width) */}
          <div className="space-y-6">

            {/* Quick Menu */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-light)]">
<h3 className="title-newtab text-sm uppercase tracking-wider mb-4">Menu Rápido</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] flex items-center justify-between group transition-colors">
                  <span className="flex items-center gap-3 font-medium">
                    <FontAwesomeIcon icon={faBookmark} className="text-[var(--brand-primary)]" />
                    Artigos Salvos
                  </span>
                  <span className="bg-[var(--bg-page)] text-xs font-bold px-2 py-1 rounded-md text-[var(--text-secondary)]">12</span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] flex items-center justify-between group transition-colors">
                  <span className="flex items-center gap-3 font-medium">
                    <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
                    Minhas Conquistas
                  </span>
                  <span className="bg-[var(--bg-page)] text-xs font-bold px-2 py-1 rounded-md text-[var(--text-secondary)]">5/20</span>
                </button>
              </div>
            </div>

            {/* Community Status */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-light)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-tertiary)]">
<h3 className="title-newtab text-sm uppercase tracking-wider mb-4">Status da Comunidade</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-tertiary)]">Ranking Global</span>
                  <span className="font-bold text-[var(--text-primary)]">#420</span>
                </div>
                <div className="w-full h-px bg-[var(--border-light)]" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-tertiary)]">Próximo Nível</span>
                  <span className="font-bold text-[var(--brand-primary)]">Em 750 XP</span>
                </div>
                <div className="w-full bg-[var(--bg-page)] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--brand-primary)] h-full w-[65%]" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
