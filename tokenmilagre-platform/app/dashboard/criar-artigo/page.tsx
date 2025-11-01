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
  faSpinner,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

type ArticleType = 'news' | 'educational' | 'resource';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CriarArtigoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [rawArticle, setRawArticle] = useState<any>(null); // Artigo bruto do Perplexity
  const [generatedArticle, setGeneratedArticle] = useState<any>(null); // Artigo processado pelo Gemini
  const [processing, setProcessing] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [refining, setRefining] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedProcessed, setCopiedProcessed] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);

  // Garantir que a página sempre inicie no topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🐛 DEBUG: Monitorar mudanças na coverImage
  useEffect(() => {
    if (generatedArticle?.coverImage) {
      console.log('🖼️ [DEBUG RENDER] generatedArticle.coverImage mudou:');
      console.log('- Valor:', generatedArticle.coverImage);
      console.log('- Tipo:', typeof generatedArticle.coverImage);
      console.log('- É array:', Array.isArray(generatedArticle.coverImage));
      if (typeof generatedArticle.coverImage === 'string') {
        console.log('- Comprimento:', generatedArticle.coverImage.length);
        console.log('- É URL (/images/):', generatedArticle.coverImage.startsWith('/images/'));
        console.log('- É base64 (data:):', generatedArticle.coverImage.startsWith('data:'));
      }
    }
  }, [generatedArticle?.coverImage]);

  // Auto-scroll ao adicionar mensagens (somente dentro do container do chat)
  useEffect(() => {
    if (conversation.length > 0 && chatContainerRef.current) {
      // Rolar apenas o container do chat, não a página inteira
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [conversation]);

  // Auto-scroll durante streaming (quando o conteúdo está crescendo)
  useEffect(() => {
    if (!chatContainerRef.current || conversation.length === 0) return;

    const container = chatContainerRef.current;

    // Função que verifica se deve fazer auto-scroll
    const shouldAutoScroll = () => {
      const threshold = 100; // pixels de tolerância
      const position = container.scrollTop + container.clientHeight;
      const bottom = container.scrollHeight;
      return bottom - position < threshold;
    };

    // Função para rolar suavemente
    const scrollToBottom = () => {
      if (shouldAutoScroll()) {
        container.scrollTop = container.scrollHeight;
      }
    };

    // Usar MutationObserver para detectar mudanças no conteúdo
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    // Observar mudanças no conteúdo do container
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [conversation.length, loading]);

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
    if (!prompt.trim()) return;

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
          // Substituir o JSON bruto por uma mensagem bonita
          setConversation(prev => {
            const newConv = [...prev];
            newConv[newConv.length - 1] = {
              role: 'assistant',
              content: '✨ **Artigo gerado pelo Perplexity!**\n\nConfira o conteúdo abaixo e clique em "Processar com Gemini" para finalizar.'
            };
            return newConv;
          });

          // Armazenar artigo bruto do Perplexity
          setRawArticle({
            ...detectedArticle,
            type: selectedType
          });
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

  const handleProcessWithGemini = async () => {
    if (!rawArticle) return;

    setProcessing(true);
    setGeneratingCover(true);

    try {
      // Feedback no chat
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: '⚙️ **Processando artigo com Gemini...**\n\n1. Refinando conteúdo\n2. 🎨 Gerando imagem de capa personalizada\n3. Validando qualidade\n\nAguarde alguns segundos...'
      }]);

      const geminiResponse = await fetch('/api/process-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: rawArticle,
          articleType: selectedType
        })
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        throw new Error(errorData.error || 'Erro ao processar com Gemini');
      }

      const { article: processedArticle } = await geminiResponse.json();

      // Salvar artigo processado
      // 🐛 DEBUG: Ver dados da imagem
      console.log('🖼️ [DEBUG] Artigo processado recebido:');
      console.log('- coverImage:', processedArticle.coverImage);
      console.log('- coverImageAlt:', processedArticle.coverImageAlt);
      console.log('- Tipo da coverImage:', typeof processedArticle.coverImage);

      // 🔧 FIX: Se coverImage for array, pegar apenas primeiro elemento
      if (Array.isArray(processedArticle.coverImage)) {
        console.warn('⚠️ coverImage veio como array! Pegando primeiro elemento.');
        processedArticle.coverImage = processedArticle.coverImage[0];
      }

      console.log('- Após normalização:', processedArticle.coverImage);
      console.log('- Começa com /images/:', processedArticle.coverImage?.startsWith('/images/'));
      console.log('- Começa com data:image:', processedArticle.coverImage?.startsWith('data:image'));
      console.log('- Primeiros 100 chars:', processedArticle.coverImage?.substring(0, 100));

      setGeneratedArticle({
        ...processedArticle,
        type: selectedType
      });

      // Limpar artigo bruto
      setRawArticle(null);

      // Adicionar confirmação no chat com info sobre capa
      const coverMessage = processedArticle.coverImage
        ? '\n\n🎨 **Imagem de capa gerada com sucesso!** A capa aparecerá no artigo publicado.'
        : '\n\n⚠️ Não foi possível gerar a imagem de capa (não crítico).';

      setConversation(prev => [...prev.slice(0, -1), {
        role: 'assistant',
        content: `✅ **Artigo processado com Gemini!**${coverMessage}\n\nConfira o preview completo abaixo. Você pode refiná-lo usando a caixa de edição no card de preview.`
      }]);

    } catch (error: any) {
      console.error('Erro ao processar com Gemini:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: `❌ Erro ao processar: ${error.message}`
      }]);
    } finally {
      setProcessing(false);
      setGeneratingCover(false);
    }
  };

  const handleCopyRawArticle = async () => {
    if (!rawArticle) return;

    try {
      let textToCopy;
      if (selectedType === 'resource') {
        textToCopy = JSON.stringify(rawArticle, null, 2);
      } else {
        textToCopy = `# ${rawArticle.title || rawArticle.name}\n\n${rawArticle.excerpt || rawArticle.description || rawArticle.shortDescription || ''}\n\n${rawArticle.content || ''}`;
      }
      await navigator.clipboard.writeText(textToCopy);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleCopyProcessedArticle = async () => {
    if (!generatedArticle) return;

    try {
      let textToCopy;
      if (selectedType === 'resource') {
        textToCopy = JSON.stringify(generatedArticle, null, 2);
      } else {
        textToCopy = `# ${generatedArticle.title || generatedArticle.name}\n\n${generatedArticle.excerpt || generatedArticle.description || generatedArticle.shortDescription || ''}\n\n${generatedArticle.content || ''}`;
      }
      await navigator.clipboard.writeText(textToCopy);
      setCopiedProcessed(true);
      setTimeout(() => setCopiedProcessed(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleRefine = async () => {
    if (!refinePrompt.trim() || !generatedArticle) return;

    const refinementRequest = refinePrompt.trim();
    setRefinePrompt('');
    setRefining(true);

    try {
      const response = await fetch('/api/refine-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: generatedArticle,
          refinementPrompt: refinementRequest,
          articleType: selectedType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao refinar artigo');
      }

      const { article: refinedArticle } = await response.json();

      setGeneratedArticle({
        ...refinedArticle,
        type: selectedType
      });

      // Adicionar feedback no chat
      setConversation(prev => [...prev,
        { role: 'user', content: `🎨 Refinar: ${refinementRequest}` },
        { role: 'assistant', content: '✅ Artigo refinado com sucesso!' }
      ]);

    } catch (error: any) {
      console.error('Erro ao refinar:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: `❌ Erro ao refinar: ${error.message}`
      }]);
    } finally {
      setRefining(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedArticle || !session?.user?.id) return;

    try {
      setProcessing(true);

      // Usar API correta baseado no tipo
      const apiEndpoint = selectedType === 'resource' ? '/api/resources' : '/api/articles';

      // Preparar tags: se já é string JSON, manter; se é array, stringificar
      const tagsToSend = typeof generatedArticle.tags === 'string'
        ? generatedArticle.tags
        : JSON.stringify(generatedArticle.tags || []);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatedArticle,
          published: selectedType !== 'resource' ? true : undefined, // published só existe em articles
          authorId: selectedType !== 'resource' ? session.user.id : undefined, // authorId só existe em articles
          tags: tagsToSend
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao publicar');
      }

      // Redirecionar baseado no tipo
      const url = selectedType === 'news'
        ? `/dashboard/noticias/${generatedArticle.slug}`
        : selectedType === 'educational'
        ? `/educacao/${generatedArticle.slug}`
        : `/recursos/${generatedArticle.slug}`;

      router.push(url);

    } catch (error: any) {
      alert(`Erro ao publicar: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AdminRoute allowEditor={true}>
      <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-4 py-8 max-w-[1600px]">
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

          <div className="space-y-6">
              {/* Área de Conversa */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)',
                }}
              >
                {/* Mensagens */}
                <div
                  ref={chatContainerRef}
                  className="p-6 space-y-4 max-h-[500px] overflow-y-auto overflow-x-hidden"
                >
                  {conversation.length === 0 && (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">🤖</div>
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {selectedType ? 'Pronto para criar conteúdo!' : 'Olá! Como posso ajudar?'}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        {selectedType
                          ? 'Descreva o que você quer criar e eu vou gerar o artigo completo.'
                          : 'Pergunte sobre análises, notícias recentes ou qualquer tema sobre criptomoedas.'}
                      </p>
                    </div>
                  )}

                  {conversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-xl break-words overflow-wrap-anywhere ${
                          msg.role === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                        }`}
                        style={{
                          backgroundColor: msg.role === 'user' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: msg.role === 'user' ? 'var(--text-inverse)' : 'var(--text-primary)',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              // Parágrafos
                              p: ({ children }) => (
                                <p className="mb-3 last:mb-0 break-words" style={{ color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)' }}>
                                  {children}
                                </p>
                              ),
                              // Títulos
                              h1: ({ children }) => (
                                <h1 className="text-2xl font-bold mb-3 mt-4" style={{ color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)' }}>
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-xl font-bold mb-2 mt-4" style={{ color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)' }}>
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-lg font-bold mb-2 mt-3" style={{ color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)' }}>
                                  {children}
                                </h3>
                              ),
                              // Texto em negrito
                              strong: ({ children }) => (
                                <strong className="font-bold" style={{ color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)' }}>
                                  {children}
                                </strong>
                              ),
                              // Texto em itálico
                              em: ({ children }) => (
                                <em className="italic" style={{ color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)' }}>
                                  {children}
                                </em>
                              ),
                              // Listas não ordenadas
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-3 space-y-1" style={{ color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)' }}>
                                  {children}
                                </ul>
                              ),
                              // Listas ordenadas
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside mb-3 space-y-1" style={{ color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)' }}>
                                  {children}
                                </ol>
                              ),
                              // Itens de lista
                              li: ({ children }) => (
                                <li className="mb-1" style={{ color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)' }}>
                                  {children}
                                </li>
                              ),
                              // Links
                              a: ({ children, href }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline hover:opacity-80"
                                  style={{ color: msg.role === 'user' ? 'inherit' : 'var(--brand-primary)' }}
                                >
                                  {children}
                                </a>
                              ),
                              // Código inline
                              code: ({ inline, children }: any) => {
                                if (inline) {
                                  return (
                                    <code
                                      className="px-1.5 py-0.5 rounded text-sm font-mono"
                                      style={{
                                        backgroundColor: msg.role === 'user' ? 'rgba(0,0,0,0.2)' : 'var(--bg-secondary)',
                                        color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)'
                                      }}
                                    >
                                      {children}
                                    </code>
                                  );
                                }
                                return (
                                  <code className="block break-all whitespace-pre-wrap overflow-x-auto max-w-full text-sm font-mono">
                                    {children}
                                  </code>
                                );
                              },
                              // Blocos de código
                              pre: ({ children }) => (
                                <pre
                                  className="break-all whitespace-pre-wrap overflow-x-auto max-w-full p-3 rounded mb-3 text-sm font-mono"
                                  style={{
                                    backgroundColor: msg.role === 'user' ? 'rgba(0,0,0,0.3)' : 'var(--bg-secondary)',
                                    color: msg.role === 'user' ? 'inherit' : 'var(--text-primary)'
                                  }}
                                >
                                  {children}
                                </pre>
                              ),
                              // Citações
                              blockquote: ({ children }) => (
                                <blockquote
                                  className="border-l-4 pl-4 py-2 mb-3 italic"
                                  style={{
                                    borderColor: msg.role === 'user' ? 'rgba(255,255,255,0.3)' : 'var(--border-medium)',
                                    color: msg.role === 'user' ? 'inherit' : 'var(--text-secondary)'
                                  }}
                                >
                                  {children}
                                </blockquote>
                              ),
                              // Linha horizontal
                              hr: () => (
                                <hr className="my-4" style={{ borderColor: msg.role === 'user' ? 'rgba(255,255,255,0.2)' : 'var(--border-light)' }} />
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
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
                      placeholder="Digite sua mensagem..."
                      disabled={loading || processing}
                      className="flex-1 px-4 py-3 rounded-xl border focus:outline-none transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!prompt.trim() || loading || processing}
                      className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </div>

                  {/* Seletor de Tipo - Movido para baixo do input */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Selecione o tipo de artigo:
                    </h3>
                    <div className="flex gap-2">
                      {/* Botão Notícia */}
                      <button
                        onClick={() => setSelectedType(selectedType === 'news' ? null : 'news')}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                          selectedType === 'news' ? '' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: selectedType === 'news' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: selectedType === 'news' ? 'var(--text-inverse)' : 'var(--text-primary)'
                        }}
                      >
                        <FontAwesomeIcon icon={faNewspaper} />
                        Notícia
                      </button>

                      {/* Botão Educação */}
                      <button
                        onClick={() => setSelectedType(selectedType === 'educational' ? null : 'educational')}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                          selectedType === 'educational' ? '' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: selectedType === 'educational' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: selectedType === 'educational' ? 'var(--text-inverse)' : 'var(--text-primary)'
                        }}
                      >
                        <FontAwesomeIcon icon={faGraduationCap} />
                        Educação
                      </button>

                      {/* Botão Recurso */}
                      <button
                        onClick={() => setSelectedType(selectedType === 'resource' ? null : 'resource')}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                          selectedType === 'resource' ? '' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: selectedType === 'resource' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: selectedType === 'resource' ? 'var(--text-inverse)' : 'var(--text-primary)'
                        }}
                      >
                        <FontAwesomeIcon icon={faBox} />
                        Recurso
                      </button>
                    </div>

                    {selectedType && (
                      <div
                        className="mt-3 p-3 rounded-lg text-sm"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          borderLeft: '3px solid #22C55E',
                          color: 'var(--text-primary)'
                        }}
                      >
                        ✅ <strong>Modo Criação Ativado:</strong> {selectedType === 'news' && 'Agora você pode pedir para criar uma notícia estruturada com padrão jornalístico completo.'}
                        {selectedType === 'educational' && 'Agora você pode pedir para criar artigos educacionais (iniciante, intermediário ou avançado).'}
                        {selectedType === 'resource' && 'Agora você pode pedir para criar guias completos de ferramentas e serviços.'}
                      </div>
                    )}

                    {!selectedType && (
                      <div
                        className="mt-3 p-3 rounded-lg text-sm"
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        💬 <strong>Modo Conversa Livre:</strong> Pergunte sobre análises, notícias recentes, conceitos técnicos ou qualquer coisa sobre cripto. Selecione um tipo acima para ativar o modo de criação de artigos.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview do Artigo Bruto (Perplexity) */}
              {rawArticle && !generatedArticle && (
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
                      📝 Preview do Perplexity
                    </h2>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCopyRawArticle}
                        className="px-4 py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center gap-2"
                        style={{
                          backgroundColor: copiedRaw ? '#10B981' : 'var(--bg-secondary)',
                          color: copiedRaw ? 'white' : 'var(--text-primary)'
                        }}
                      >
                        <FontAwesomeIcon icon={copiedRaw ? faCheck : faCopy} />
                        {copiedRaw ? 'Copiado!' : 'Copiar'}
                      </button>
                      <button
                        onClick={handleProcessWithGemini}
                        disabled={processing}
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--brand-primary)',
                          color: 'var(--text-inverse)'
                        }}
                      >
                        {processing ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin />
                            {generatingCover ? 'Gerando capa...' : 'Processando...'}
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheck} />
                            Processar com Gemini + Gerar Capa 🎨
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {rawArticle.title || rawArticle.name}
                    </h3>
                    <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {rawArticle.excerpt || rawArticle.description || rawArticle.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}>
                        {rawArticle.category}
                      </span>
                      {rawArticle.sentiment && (
                        <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)'
                        }}>
                          {rawArticle.sentiment}
                        </span>
                      )}
                      {rawArticle.level && (
                        <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)'
                        }}>
                          {rawArticle.level}
                        </span>
                      )}
                      {rawArticle.readTime && (
                        <span className="px-3 py-1 rounded-lg text-sm" style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-tertiary)'
                        }}>
                          {rawArticle.readTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <article className="prose prose-lg max-w-none" style={{ color: 'var(--text-primary)' }}>
                    {selectedType === 'resource' ? (
                      // Preview simplificado para Recursos (JSON bruto)
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                          <pre className="text-sm overflow-auto" style={{ color: 'var(--text-primary)' }}>
                            {JSON.stringify(rawArticle, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      // Preview para Artigos
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
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-3" style={{ color: 'var(--text-primary)' }}>
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-3" style={{ color: 'var(--text-primary)' }}>
                              {children}
                            </ol>
                          ),
                        }}
                      >
                        {rawArticle.content}
                      </ReactMarkdown>
                    )}
                  </article>

                  {/* Aviso */}
                  <div
                    className="mt-6 p-4 rounded-xl"
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderLeft: '4px solid var(--brand-primary)'
                    }}
                  >
                    <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                      ℹ️ Este é o conteúdo gerado pelo Perplexity. Revise e clique em <strong>"Processar com Gemini + Gerar Capa 🎨"</strong> para:
                    </p>
                    <ul className="text-sm space-y-1 ml-4" style={{ color: 'var(--text-primary)' }}>
                      <li>✅ Aplicar melhorias de formatação e qualidade</li>
                      <li>🎨 Gerar imagem de capa personalizada com IA</li>
                      <li>🔍 Validar estrutura do conteúdo</li>
                    </ul>
                  </div>
                </div>
              )}

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
                    <div className="flex items-center gap-3">
                      <h2
                        className="text-2xl font-bold font-[family-name:var(--font-poppins)]"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Preview do Artigo
                      </h2>
                      {generatedArticle.coverImage && (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{
                          backgroundColor: '#10B981',
                          color: 'white'
                        }}>
                          🎨 Com capa
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCopyProcessedArticle}
                        className="px-4 py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center gap-2"
                        style={{
                          backgroundColor: copiedProcessed ? '#10B981' : 'var(--bg-secondary)',
                          color: copiedProcessed ? 'white' : 'var(--text-primary)'
                        }}
                      >
                        <FontAwesomeIcon icon={copiedProcessed ? faCheck : faCopy} />
                        {copiedProcessed ? 'Copiado!' : 'Copiar'}
                      </button>
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
                  </div>

                  {/* Imagem de Capa Preview */}
                  {generatedArticle.coverImage && (
                    <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                      {/* 🐛 DEBUG: Log antes de renderizar */}
                      {console.log('🖼️ [DEBUG IMG TAG] Renderizando <img> com src:', generatedArticle.coverImage)}
                      <img
                        src={generatedArticle.coverImage}
                        alt={generatedArticle.coverImageAlt || generatedArticle.title || 'Capa do artigo'}
                        className="w-full h-[300px] object-cover"
                        onError={(e) => {
                          console.error('❌ [DEBUG IMG TAG] Erro ao carregar imagem!');
                          console.error('- src tentado:', generatedArticle.coverImage);
                          console.error('- Evento de erro:', e);
                        }}
                        onLoad={() => {
                          console.log('✅ [DEBUG IMG TAG] Imagem carregada com sucesso!');
                        }}
                      />
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {generatedArticle.title || generatedArticle.name}
                    </h3>
                    <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {generatedArticle.excerpt || generatedArticle.description || generatedArticle.shortDescription}
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
                  <article className="prose prose-lg max-w-none mb-6" style={{ color: 'var(--text-primary)' }}>
                    {selectedType === 'resource' ? (
                      // Preview para Recursos
                      <div className="space-y-6">
                        {/* Hero */}
                        {generatedArticle.heroDescription && (
                          <div>
                            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                              Sobre
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{generatedArticle.heroDescription}</p>
                          </div>
                        )}

                        {/* Features */}
                        {generatedArticle.features && generatedArticle.features.length > 0 && (
                          <div>
                            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                              Principais Funcionalidades
                            </h2>
                            <div className="grid gap-3">
                              {generatedArticle.features.map((feature: any, idx: number) => (
                                <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                    {feature.title}
                                  </h3>
                                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {feature.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Prós e Contras */}
                        {(generatedArticle.pros || generatedArticle.cons) && (
                          <div className="grid md:grid-cols-2 gap-4">
                            {generatedArticle.pros && (
                              <div>
                                <h3 className="font-bold mb-2 text-green-600">Vantagens</h3>
                                <ul className="list-disc list-inside space-y-1">
                                  {generatedArticle.pros.map((pro: string, idx: number) => (
                                    <li key={idx} style={{ color: 'var(--text-secondary)' }}>{pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {generatedArticle.cons && (
                              <div>
                                <h3 className="font-bold mb-2 text-orange-600">Desvantagens</h3>
                                <ul className="list-disc list-inside space-y-1">
                                  {generatedArticle.cons.map((con: string, idx: number) => (
                                    <li key={idx} style={{ color: 'var(--text-secondary)' }}>{con}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Platforms */}
                        {generatedArticle.platforms && generatedArticle.platforms.length > 0 && (
                          <div>
                            <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                              Plataformas
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {generatedArticle.platforms.map((platform: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 rounded-lg text-sm" style={{
                                  backgroundColor: 'var(--bg-secondary)',
                                  color: 'var(--text-primary)'
                                }}>
                                  {platform}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Preview para Artigos (News/Educational)
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
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-3" style={{ color: 'var(--text-primary)' }}>
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-3" style={{ color: 'var(--text-primary)' }}>
                              {children}
                            </ol>
                          ),
                        }}
                      >
                        {generatedArticle.content}
                      </ReactMarkdown>
                    )}
                  </article>

                  {/* Caixa de Refinamento */}
                  <div
                    className="mt-6 pt-6 border-t"
                    style={{ borderColor: 'var(--border-light)' }}
                  >
                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      🎨 Refinar Artigo com IA
                    </h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Descreva as alterações que deseja fazer no artigo:
                    </p>
                    <div className="flex gap-3">
                      <textarea
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                        placeholder="Ex: Adicione mais detalhes sobre..., Mude o tom para mais técnico, Simplifique a linguagem..."
                        disabled={refining}
                        rows={3}
                        className="flex-1 px-4 py-3 rounded-xl border focus:outline-none transition-colors resize-none"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-medium)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <button
                        onClick={handleRefine}
                        disabled={!refinePrompt.trim() || refining}
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed self-end flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--brand-primary)',
                          color: 'var(--text-inverse)'
                        }}
                      >
                        {refining ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin />
                            Refinando...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faPaperPlane} />
                            Refinar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
