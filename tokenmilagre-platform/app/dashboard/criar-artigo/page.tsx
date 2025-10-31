'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faGraduationCap,
  faBox,
  faPaperPlane,
  faArrowLeft,
  faCheck,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

type ArticleType = 'news' | 'education' | 'resource';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CriarArtigoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [generatedArticle, setGeneratedArticle] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  // Auto-scroll ao adicionar mensagens
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const detectJSON = (text: string): any | null => {
    // Detectar se há JSON na mensagem (com ou sem markdown code blocks)
    const jsonMatch = text.match(/```json\n?([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (!prompt.trim() || !selectedType) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // 1. Chamar Perplexity com streaming
      const response = await fetch('/api/chat-perplexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversation, { role: 'user', content: userMessage }],
          articleType: selectedType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao chamar Perplexity');
      }

      // 2. Processar streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        // Adicionar mensagem vazia que será preenchida pelo streaming
        setConversation(prev => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          // Atualizar última mensagem com texto acumulado
          setConversation(prev => {
            const newConv = [...prev];
            newConv[newConv.length - 1] = { role: 'assistant', content: accumulatedText };
            return newConv;
          });
        }

        // 3. Detectar se é JSON (artigo gerado)
        const detectedArticle = detectJSON(accumulatedText);

        if (detectedArticle) {
          setProcessing(true);

          // 4. Chamar Gemini para processar
          const geminiResponse = await fetch('/api/process-gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              article: detectedArticle,
              articleType: selectedType
            })
          });

          if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            throw new Error(errorData.error || 'Erro ao processar com Gemini');
          }

          const { article: processedArticle } = await geminiResponse.json();

          // 5. Salvar artigo processado
          setGeneratedArticle({
            ...processedArticle,
            type: selectedType
          });

          setProcessing(false);

          // Adicionar confirmação no chat
          setConversation(prev => [...prev, {
            role: 'assistant',
            content: '✅ Artigo processado e pronto para preview!'
          }]);
        }
      }

    } catch (error: any) {
      console.error('Erro:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: `❌ Erro: ${error.message}`
      }]);
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedArticle || !session?.user?.id) return;

    try {
      setProcessing(true);

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatedArticle,
          published: true,
          authorId: session.user.id,
          tags: JSON.stringify(generatedArticle.tags || [])
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao publicar');
      }

      // Redirecionar para o artigo publicado
      const url = generatedArticle.type === 'news'
        ? `/dashboard/noticias/${generatedArticle.slug}`
        : `/educacao/${generatedArticle.slug}`;

      router.push(url);

    } catch (error: any) {
      alert(`Erro ao publicar: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AdminRoute allowEditor={true}>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Voltar ao Dashboard
            </Link>

            <h1
              className="text-4xl font-bold font-[family-name:var(--font-poppins)] mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Criar Artigo com IA
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Converse livremente com a IA para criar artigos completos
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar - Seletor de Tipo */}
            <div className="lg:col-span-1">
              <div
                className="rounded-2xl p-6 border sticky top-24"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)',
                }}
              >
                <h2
                  className="text-xl font-bold mb-4 font-[family-name:var(--font-poppins)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Tipo de Artigo
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Escolha o tipo de conteúdo que deseja criar:
                </p>

                <div className="space-y-3">
                  {/* Botão Notícia */}
                  <button
                    onClick={() => setSelectedType('news')}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedType === 'news' ? 'shadow-lg scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: selectedType === 'news' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                      borderColor: selectedType === 'news' ? 'var(--brand-primary)' : 'var(--border-light)',
                      color: selectedType === 'news' ? 'var(--text-inverse)' : 'var(--text-primary)'
                    }}
                  >
                    <FontAwesomeIcon icon={faNewspaper} className="text-2xl mb-2" />
                    <div className="font-bold">Notícia</div>
                    <div className="text-sm opacity-80">
                      Eventos atuais do mercado cripto
                    </div>
                  </button>

                  {/* Botão Educação */}
                  <button
                    onClick={() => setSelectedType('education')}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedType === 'education' ? 'shadow-lg scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: selectedType === 'education' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                      borderColor: selectedType === 'education' ? 'var(--brand-primary)' : 'var(--border-light)',
                      color: selectedType === 'education' ? 'var(--text-inverse)' : 'var(--text-primary)'
                    }}
                  >
                    <FontAwesomeIcon icon={faGraduationCap} className="text-2xl mb-2" />
                    <div className="font-bold">Educação</div>
                    <div className="text-sm opacity-80">
                      Artigos educacionais e tutoriais
                    </div>
                  </button>

                  {/* Botão Recurso */}
                  <button
                    onClick={() => setSelectedType('resource')}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedType === 'resource' ? 'shadow-lg scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: selectedType === 'resource' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                      borderColor: selectedType === 'resource' ? 'var(--brand-primary)' : 'var(--border-light)',
                      color: selectedType === 'resource' ? 'var(--text-inverse)' : 'var(--text-primary)'
                    }}
                  >
                    <FontAwesomeIcon icon={faBox} className="text-2xl mb-2" />
                    <div className="font-bold">Recurso</div>
                    <div className="text-sm opacity-80">
                      Guias de ferramentas e serviços
                    </div>
                  </button>
                </div>

                {selectedType && (
                  <div
                    className="mt-6 p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      💡 Dica
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {selectedType === 'news' && 'Você pode pedir para listar notícias recentes ou criar uma notícia específica.'}
                      {selectedType === 'education' && 'Defina o nível (iniciante, intermediário, avançado) e o tema desejado.'}
                      {selectedType === 'resource' && 'Descreva a ferramenta ou serviço que deseja documentar.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main - Chat e Preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Área de Conversa */}
              <div
                className="rounded-2xl border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)',
                  minHeight: '500px'
                }}
              >
                {/* Mensagens */}
                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                  {conversation.length === 0 && (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">🤖</div>
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Pronto para criar conteúdo incrível?
                      </h3>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        Selecione um tipo de artigo e comece a conversar!
                      </p>
                    </div>
                  )}

                  {conversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-xl ${
                          msg.role === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                        }`}
                        style={{
                          backgroundColor: msg.role === 'user' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: msg.role === 'user' ? 'var(--text-inverse)' : 'var(--text-primary)'
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div
                        className="p-4 rounded-xl rounded-bl-none"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                      >
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {processing && (
                    <div className="flex justify-start">
                      <div
                        className="p-4 rounded-xl rounded-bl-none flex items-center gap-2"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                      >
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Processando com Gemini...
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div
                  className="p-4 border-t"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={
                        selectedType
                          ? 'Digite sua mensagem...'
                          : 'Selecione um tipo de artigo primeiro...'
                      }
                      disabled={!selectedType || loading || processing}
                      className="flex-1 px-4 py-3 rounded-xl border focus:outline-none transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!prompt.trim() || !selectedType || loading || processing}
                      className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview do Artigo (quando gerado) */}
              {generatedArticle && (
                <div
                  className="rounded-2xl p-6 border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)',
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2
                      className="text-2xl font-bold font-[family-name:var(--font-poppins)]"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Preview do Artigo
                    </h2>
                    <button
                      onClick={handlePublish}
                      disabled={processing}
                      className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                      style={{
                        backgroundColor: '#10B981',
                        color: 'white'
                      }}
                    >
                      {processing ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Publicando...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheck} />
                          Publicar Artigo
                        </>
                      )}
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {generatedArticle.title}
                    </h3>
                    <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {generatedArticle.excerpt || generatedArticle.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}>
                        {generatedArticle.category}
                      </span>
                      {generatedArticle.sentiment && (
                        <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)'
                        }}>
                          {generatedArticle.sentiment}
                        </span>
                      )}
                      {generatedArticle.level && (
                        <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)'
                        }}>
                          {generatedArticle.level}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-lg text-sm" style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-tertiary)'
                      }}>
                        {generatedArticle.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <article className="prose prose-lg max-w-none" style={{ color: 'var(--text-primary)' }}>
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => (
                          <h2 className="text-xl font-bold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-3" style={{ color: 'var(--text-primary)' }}>
                            {children}
                          </p>
                        ),
                      }}
                    >
                      {generatedArticle.content?.substring(0, 1000) + '...'}
                    </ReactMarkdown>
                  </article>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
