'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faBars, faNewspaper, faUsers, faCog, faHome } from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';
import AIAssistant from '../_components/AIAssistant';
import ArticleCanvas from '@/components/admin/ArticleCanvas';

export default function ChatPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>(null);

  // Escutar evento de abrir canvas
  useEffect(() => {
    const handleOpenCanvas = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { article } = customEvent.detail;

      setCurrentArticle(article);
      setCanvasOpen(true);
    };

    window.addEventListener('open-article-canvas', handleOpenCanvas);
    return () => window.removeEventListener('open-article-canvas', handleOpenCanvas);
  }, []);

  // Salvar alterações do artigo
  const handleSaveArticle = async (updatedArticle: any) => {
    try {
      const response = await fetch(`/api/articles/${updatedArticle.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedArticle.title,
          excerpt: updatedArticle.summary,
          content: updatedArticle.content
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Artigo salvo com sucesso!');
        setCanvasOpen(false);
      } else {
        throw new Error(data.error || 'Erro ao salvar');
      }
    } catch (error: any) {
      alert(`❌ Erro ao salvar: ${error.message}`);
    }
  };

  return (
    <AdminRoute allowEditor={false}>
      <div className="h-screen flex flex-col" style={{ background: '#232627' }}>
        {/* Simple Header */}
        <div className="p-3 border-b" style={{ borderColor: '#3a3d3e', backgroundColor: '#232627' }}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))' }}
              >
                <FontAwesomeIcon icon={faRobot} className="text-white text-xs" />
              </div>
              <h1
                className="text-base font-bold font-[family-name:var(--font-poppins)]"
                style={{ color: '#e8e8e8' }}
              >
                Chat AI
              </h1>
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:brightness-110 transition-all"
                style={{
                  backgroundColor: '#3a3d3e',
                  color: '#9a9a9a'
                }}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-20"
                    style={{
                      backgroundColor: '#2f3233',
                      borderColor: '#3a3d3e'
                    }}
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 hover:brightness-110 transition-all border-b"
                      style={{ borderColor: '#3a3d3e' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faHome} style={{ color: '#9a9a9a' }} />
                      <span style={{ color: '#e8e8e8' }}>Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard/artigos"
                      className="flex items-center gap-3 px-4 py-2 hover:brightness-110 transition-all border-b"
                      style={{ borderColor: '#3a3d3e' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faNewspaper} style={{ color: '#9a9a9a' }} />
                      <span style={{ color: '#e8e8e8' }}>Artigos</span>
                    </Link>
                    <Link
                      href="/dashboard/usuarios"
                      className="flex items-center gap-3 px-4 py-2 hover:brightness-110 transition-all border-b"
                      style={{ borderColor: '#3a3d3e' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faUsers} style={{ color: '#9a9a9a' }} />
                      <span style={{ color: '#e8e8e8' }}>Usuários</span>
                    </Link>
                    <Link
                      href="/dashboard/configuracoes"
                      className="flex items-center gap-3 px-4 py-2 hover:brightness-110 transition-all"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faCog} style={{ color: '#9a9a9a' }} />
                      <span style={{ color: '#e8e8e8' }}>Configurações</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant - Full Screen */}
        <div className="flex-1 overflow-hidden">
          <AIAssistant
            pageData={{ title: 'Chat AI', context: 'admin' }}
            model="sonar"
          />
        </div>
      </div>

      {/* Article Canvas */}
      <ArticleCanvas
        isOpen={canvasOpen}
        article={currentArticle}
        onClose={() => setCanvasOpen(false)}
        onSave={handleSaveArticle}
      />
    </AdminRoute>
  );
}
