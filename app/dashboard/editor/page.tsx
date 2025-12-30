'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';

// Dynamic import for TipTapEditor (heavy)
const TipTapEditor = dynamic(() => import('@/app/lab/editor/TipTapEditor'), {
      ssr: false,
      loading: () => <div className="animate-pulse bg-milagre-800 h-96 rounded-xl w-full" />
});

export default function EditorPage() {
      const router = useRouter();
      const [title, setTitle] = useState('');
      const [content, setContent] = useState('<p>Comece a escrever aqui...</p>');
      const [isSaving, setIsSaving] = useState(false);

      // Mock save function - in real world this hooks to API
      const handleSave = async () => {
            setIsSaving(true);
            try {
                  console.log('Saving Article:', { title, content });
                  // Simulate API delay
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  alert('Artigo salvo com sucesso! (Simulação)');
                  // router.push('/dashboard/artigos');
            } catch (error) {
                  console.error('Erro ao salvar:', error);
                  alert('Erro ao salvar');
            } finally {
                  setIsSaving(false);
            }
      };

      return (
            <div className="min-h-screen bg-milagre-900 text-white flex flex-col">
                  {/* Top Bar */}
                  <header className="sticky top-0 z-50 bg-milagre-900/80 backdrop-blur-md border-b border-milagre-800 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                              <button
                                    onClick={() => router.back()}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-milagre-800 transition-colors text-gray-400 hover:text-white"
                              >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                              </button>
                              <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Título do Artigo"
                                    className="bg-transparent text-xl font-bold placeholder-gray-600 focus:outline-none w-[400px]"
                              />
                        </div>

                        <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 uppercase tracking-wider">
                                    {isSaving ? 'Salvando...' : 'Não salvo'}
                              </span>
                              <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${isSaving
                                                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                                : 'bg-gradient-to-r from-milagre-gold to-yellow-500 text-milagre-900 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95'
                                          }`}
                              >
                                    <FontAwesomeIcon icon={faSave} />
                                    Salvar
                              </button>
                        </div>
                  </header>

                  {/* Editor Area */}
                  <main className="flex-1 max-w-5xl mx-auto w-full p-8">
                        <TipTapEditor
                              initialContent={content}
                              onChange={setContent}
                        />
                  </main>
            </div>
      );
}
