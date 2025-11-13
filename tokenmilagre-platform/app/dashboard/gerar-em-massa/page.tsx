'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faNewspaper,
  faGraduationCap,
  faToolbox,
  faPlay,
  faCheck,
  faXmark,
  faSpinner,
  faArrowLeft,
  faExclamationTriangle,
  faCheckCircle,
  faDatabase,
  faBolt
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';

interface GeneratedArticle {
  id: string;
  type: 'news' | 'educational' | 'resource';
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  citations?: string[];
  selected: boolean;
  status: 'pending' | 'generating' | 'success' | 'error';
  error?: string;
}

const TOPICS = {
  news: [
    'Bitcoin ultrapassa marcos históricos no mercado',
    'Ethereum completa upgrade importante na rede',
    'Regulamentação cripto: novidades no Brasil',
    'Grandes empresas adotando Bitcoin como reserva',
    'DeFi alcança novo recorde de TVL',
    'Solana: atualizações e desenvolvimentos recentes',
    'NFTs: novos casos de uso e tendências',
    'Segurança cripto: últimos ataques e proteções',
    'Stablecoins: crescimento e regulamentação',
    'Web3: investimentos e inovações recentes'
  ],
  educational: [
    'Guia completo: Como comprar sua primeira criptomoeda',
    'Blockchain explicado: A tecnologia por trás do Bitcoin',
    'Hot Wallets vs Cold Wallets: Qual escolher?',
    'Smart Contracts: O que são e como funcionam',
    'DeFi para iniciantes: Finanças descentralizadas explicadas',
    'Análise técnica em criptomoedas: Guia prático',
    'Como identificar e evitar golpes cripto',
    'NFTs: Casos de uso além de arte digital',
    'Tokenomics: Entendendo a economia dos tokens',
    'Layer 2: Escalabilidade do Ethereum explicada'
  ],
  resource: [
    'MetaMask: A carteira essencial para Ethereum',
    'Ledger: Segurança máxima para suas criptos',
    'Phantom: Carteira oficial do ecossistema Solana',
    'Binance: A maior exchange de criptomoedas',
    'Etherscan: Explorando a blockchain Ethereum',
    'Uniswap: DeFi e swaps descentralizados',
    'Aave: Empréstimos DeFi sem intermediários',
    'Brave Browser: Navegue e ganhe criptomoedas',
    'CoinGecko: Rastreador de preços e dados',
    'DexScreener: Analytics para DEXs em tempo real'
  ]
};

export default function GerarEmMassaPage() {
  const [contentType, setContentType] = useState<'news' | 'educational' | 'resource'>('news');
  const [quantity, setQuantity] = useState(5);
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  const startGeneration = async () => {
    const topics = TOPICS[contentType].slice(0, quantity);
    setTotalSteps(topics.length);
    setCurrentStep(0);
    setIsGenerating(true);

    const newArticles: GeneratedArticle[] = topics.map((topic, index) => ({
      id: `article-${Date.now()}-${index}`,
      type: contentType,
      title: topic,
      selected: true,
      status: 'pending'
    }));

    setArticles(newArticles);

    // Gerar artigos sequencialmente
    for (let i = 0; i < newArticles.length; i++) {
      setCurrentStep(i + 1);
      await generateSingleArticle(newArticles[i], i);
      await sleep(2000); // Delay de 2s entre requisições
    }

    setIsGenerating(false);
  };

  const validateResourceData = (data: any): string[] => {
    const errors: string[] = [];

    if (!data.name) errors.push('name');
    if (!data.slug) errors.push('slug');
    if (!data.category) errors.push('category');
    if (!data.officialUrl || !data.officialUrl.startsWith('http'))
      errors.push('officialUrl (deve ser URL válida)');
    if (!data.shortDescription) errors.push('shortDescription');
    if (!data.heroTitle) errors.push('heroTitle');
    if (!data.heroDescription) errors.push('heroDescription');
    if (!data.heroGradient) errors.push('heroGradient');
    if (!data.whyGoodTitle) errors.push('whyGoodTitle');
    if (!data.whyGoodContent || !Array.isArray(data.whyGoodContent) || data.whyGoodContent.length < 5)
      errors.push('whyGoodContent (mínimo 5 parágrafos)');
    if (!data.features || !Array.isArray(data.features) || data.features.length < 6)
      errors.push('features (mínimo 6)');
    if (!data.howToStartTitle) errors.push('howToStartTitle');
    if (!data.howToStartSteps || !Array.isArray(data.howToStartSteps) || data.howToStartSteps.length < 5)
      errors.push('howToStartSteps (mínimo 5)');
    if (!data.pros || !Array.isArray(data.pros) || data.pros.length < 8)
      errors.push('pros (mínimo 8)');
    if (!data.cons || !Array.isArray(data.cons) || data.cons.length < 5)
      errors.push('cons (exatos 5)');
    if (!data.faq || !Array.isArray(data.faq) || data.faq.length < 4)
      errors.push('faq (mínimo 4)');
    if (!data.securityTips || !Array.isArray(data.securityTips) || data.securityTips.length < 6)
      errors.push('securityTips (mínimo 6)');

    return errors;
  };

  const generateSingleArticle = async (article: GeneratedArticle, index: number) => {
    try {
      // Atualizar status para "generating"
      setArticles(prev => prev.map(a =>
        a.id === article.id ? { ...a, status: 'generating' } : a
      ));

      console.log(`🚀 [${index + 1}] Gerando: ${article.title}`);

      const response = await fetch('/api/chat-perplexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: article.title
            }
          ],
          articleType: article.type
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log(`🔍 [${index + 1}] Resposta recebida:`, {
        hasContent: !!data.content,
        contentLength: data.content?.length,
        hasCitations: !!data.citations,
        citationsCount: data.citations?.length
      });

      // Extrair JSON do content com parsing robusto
      let parsedContent;
      try {
        // Tentar extrair JSON de code block markdown (suporta ```json e ```)
        const jsonMatch = data.content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1].trim() : data.content.trim();

        console.log(`📄 [${index + 1}] JSON extraído (preview):`, jsonString.substring(0, 200));

        parsedContent = JSON.parse(jsonString);
      } catch (e) {
        console.error(`❌ [${index + 1}] Erro ao parsear JSON:`, e);
        console.error(`📄 [${index + 1}] Conteúdo recebido:`, data.content.substring(0, 500));
        throw new Error('Resposta da IA não está em formato JSON válido');
      }

      // Validar estrutura se for recurso
      if (article.type === 'resource') {
        const validationErrors = validateResourceData(parsedContent);
        if (validationErrors.length > 0) {
          console.error(`❌ [${index + 1}] Validação falhou:`, validationErrors);
          throw new Error(`Dados incompletos: ${validationErrors.join(', ')}`);
        }

        console.log(`✅ [${index + 1}] Validação OK:`, {
          name: parsedContent.name,
          category: parsedContent.category,
          featuresCount: parsedContent.features?.length,
          prosCount: parsedContent.pros?.length,
          consCount: parsedContent.cons?.length
        });
      }

      // Atualizar artigo com dados gerados
      setArticles(prev => prev.map(a =>
        a.id === article.id ? {
          ...a,
          ...parsedContent,
          citations: data.citations || [],
          status: 'success'
        } : a
      ));

      console.log(`✅ [${index + 1}] Gerado com sucesso: ${parsedContent.title || parsedContent.name}`);

    } catch (error: any) {
      console.error(`❌ [${index + 1}] Erro ao gerar artigo:`, error);
      setArticles(prev => prev.map(a =>
        a.id === article.id ? {
          ...a,
          status: 'error',
          error: error.message
        } : a
      ));
    }
  };

  const saveSelectedArticles = async () => {
    const selected = articles.filter(a => a.selected && a.status === 'success');

    if (selected.length === 0) {
      alert('Selecione pelo menos um artigo para salvar!');
      return;
    }

    setIsGenerating(true);

    const VALID_CATEGORIES = [
      'exchange', 'wallet', 'defi-protocol', 'analytics',
      'portfolio-tracker', 'news', 'education', 'development-tools'
    ];

    try {
      const endpoint = contentType === 'resource' ? '/api/resources' : '/api/articles';

      for (let i = 0; i < selected.length; i++) {
        const article = selected[i];
        let payload: any;

        console.log(`💾 [${i + 1}/${selected.length}] Salvando: ${article.title}`);

        if (contentType === 'resource') {
          // Para recursos, precisamos de TODOS os campos obrigatórios
          const resourceData = article as any;

          // Validar categoria
          const category = VALID_CATEGORIES.includes(resourceData.category)
            ? resourceData.category
            : 'wallet'; // Default válido

          payload = {
            name: resourceData.name || article.title,
            slug: resourceData.slug || generateSlug(resourceData.name || article.title),
            category,
            shortDescription: resourceData.shortDescription || article.excerpt || '',
            officialUrl: resourceData.officialUrl || '',
            platforms: resourceData.platforms || [],
            tags: resourceData.tags || [],
            heroTitle: resourceData.heroTitle || article.title,
            heroDescription: resourceData.heroDescription || article.excerpt || '',
            heroGradient: resourceData.heroGradient || 'linear-gradient(135deg, #7C3AED, #F59E0B)',
            whyGoodTitle: resourceData.whyGoodTitle || `Por que ${resourceData.name || article.title} é uma boa escolha?`,
            whyGoodContent: resourceData.whyGoodContent || [],
            features: resourceData.features || [],
            howToStartTitle: resourceData.howToStartTitle || `Como Começar a Usar ${resourceData.name || article.title}`,
            howToStartSteps: resourceData.howToStartSteps || [],
            pros: resourceData.pros || [],
            cons: resourceData.cons || [],
            faq: resourceData.faq || [],
            securityTips: resourceData.securityTips || [],
            verified: true,
            sources: JSON.stringify(article.citations || []),
            showCompatibleWallets: resourceData.showCompatibleWallets || false,
            relatedResources: resourceData.relatedResources || null
          };

          console.log(`📦 [${i + 1}] Payload do recurso:`, {
            name: payload.name,
            slug: payload.slug,
            category: payload.category,
            featuresCount: payload.features.length,
            prosCount: payload.pros.length,
            consCount: payload.cons.length
          });
        } else {
          // Para artigos (news/educational)
          payload = {
            type: article.type,
            title: article.title,
            slug: generateSlug(article.title, article.type === 'news'),
            content: article.content,
            excerpt: article.excerpt,
            category: article.category,
            tags: article.tags,
            published: true,
            factCheckSources: JSON.stringify(article.citations || [])
          };

          // Campos específicos para educational
          if (article.type === 'educational') {
            payload.level = (article as any).level || 'iniciante';
            payload.contentType = (article as any).contentType || 'Artigo';
          }

          // Campos específicos para news
          if (article.type === 'news') {
            payload.sentiment = (article as any).sentiment || 'neutral';
          }

          console.log(`📰 [${i + 1}] Payload do artigo:`, {
            type: payload.type,
            title: payload.title,
            slug: payload.slug,
            category: payload.category
          });
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || response.statusText;
          console.error(`❌ [${i + 1}] Erro ao salvar:`, {
            status: response.status,
            error: errorMessage,
            details: errorData.details
          });
          throw new Error(`Erro ao salvar "${article.title}": ${errorMessage}`);
        }

        const result = await response.json();
        console.log(`✅ [${i + 1}] Salvo com sucesso:`, result);
      }

      alert(`✅ ${selected.length} artigo(s) salvos com sucesso!`);

      // Resetar
      setArticles([]);
      setCurrentStep(0);
      setTotalSteps(0);

    } catch (error: any) {
      console.error('❌ Erro detalhado ao salvar:', error);
      alert(`❌ Erro ao salvar artigos: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleArticleSelection = (id: string) => {
    setArticles(prev => prev.map(a =>
      a.id === id ? { ...a, selected: !a.selected } : a
    ));
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateSlug = (title: string, addDate: boolean = false): string => {
    let slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (addDate) {
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
      slug = `${slug}-${dateStr}`;
    } else {
      // Adicionar timestamp para garantir unicidade
      const timestamp = Date.now().toString(36);
      slug = `${slug}-${timestamp}`;
    }

    return slug.substring(0, 100);
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'news':
        return {
          icon: faNewspaper,
          label: 'Notícias',
          color: '#3b82f6',
          gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
        };
      case 'educational':
        return {
          icon: faGraduationCap,
          label: 'Educacional',
          color: '#10b981',
          gradient: 'linear-gradient(135deg, #10b981, #059669)'
        };
      case 'resource':
        return {
          icon: faToolbox,
          label: 'Recursos',
          color: '#f59e0b',
          gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
        };
      default:
        return {
          icon: faRobot,
          label: 'Desconhecido',
          color: '#6b7280',
          gradient: 'linear-gradient(135deg, #6b7280, #4b5563)'
        };
    }
  };

  const selectedCount = articles.filter(a => a.selected).length;
  const successCount = articles.filter(a => a.status === 'success').length;
  const errorCount = articles.filter(a => a.status === 'error').length;

  return (
    <AdminRoute allowEditor={true}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-4 hover:underline"
              style={{ color: 'var(--brand-primary)' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>

            <div className="flex items-center gap-4 mb-2">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #F59E0B)' }}
              >
                <FontAwesomeIcon icon={faRobot} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Geração em Massa com IA
                </h1>
                <p className="text-lg mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Popule seu banco de dados automaticamente com conteúdo de qualidade
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          {articles.length === 0 && (
            <div
              className="rounded-2xl p-8 border shadow-lg mb-8"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}
            >
              <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Configuração da Geração
              </h2>

              {/* Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Tipo de Conteúdo
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['news', 'educational', 'resource'] as const).map((type) => {
                    const config = getTypeConfig(type);
                    const isSelected = contentType === type;

                    return (
                      <button
                        key={type}
                        onClick={() => setContentType(type)}
                        className="p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: isSelected ? `${config.color}15` : 'var(--bg-secondary)',
                          borderColor: isSelected ? config.color : 'var(--border-light)',
                          boxShadow: isSelected ? `0 0 20px ${config.color}30` : 'none'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: config.gradient }}
                          >
                            <FontAwesomeIcon icon={config.icon} className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold" style={{ color: isSelected ? config.color : 'var(--text-primary)' }}>
                            {config.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Quantidade de Artigos
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="flex-1"
                    style={{ accentColor: 'var(--brand-primary)' }}
                  />
                  <div
                    className="w-20 text-center font-bold text-2xl px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'white'
                    }}
                  >
                    {quantity}
                  </div>
                </div>
                <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  Custo estimado: ~${(quantity * 0.008).toFixed(3)} USD (modelo sonar)
                </p>
              </div>

              {/* Topics Preview */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Tópicos que Serão Gerados
                </label>
                <div
                  className="rounded-lg p-4 space-y-2"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  {TOPICS[contentType].slice(0, quantity).map((topic, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          backgroundColor: 'var(--brand-primary)',
                          color: 'white'
                        }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={startGeneration}
                disabled={isGenerating}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)'
                }}
              >
                <FontAwesomeIcon icon={faBolt} className="w-6 h-6" />
                Gerar {quantity} {getTypeConfig(contentType).label} Automaticamente
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {isGenerating && totalSteps > 0 && (
            <div
              className="rounded-2xl p-6 border shadow-lg mb-8"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Gerando Artigos...
                </h3>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {currentStep} / {totalSteps}
                </span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(currentStep / totalSteps) * 100}%`,
                    background: 'linear-gradient(135deg, #7C3AED, #F59E0B)'
                  }}
                />
              </div>
            </div>
          )}

          {/* Generated Articles List */}
          {articles.length > 0 && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-light)'
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Total Gerados</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{articles.length}</p>
                </div>
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-light)'
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Sucesso</p>
                  <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{successCount}</p>
                </div>
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-light)'
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Erros</p>
                  <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>{errorCount}</p>
                </div>
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-light)'
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Selecionados</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>{selectedCount}</p>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="space-y-4 mb-6">
                {articles.map((article) => {
                  const config = getTypeConfig(article.type);

                  return (
                    <div
                      key={article.id}
                      className="rounded-xl p-6 border transition-all duration-300"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: article.selected ? config.color : 'var(--border-light)',
                        boxShadow: article.selected ? `0 0 20px ${config.color}30` : 'none',
                        opacity: article.status === 'generating' ? 0.7 : 1
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleArticleSelection(article.id)}
                          disabled={article.status !== 'success'}
                          className="mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{
                            borderColor: article.selected ? config.color : 'var(--border-medium)',
                            backgroundColor: article.selected ? config.color : 'transparent'
                          }}
                        >
                          {article.selected && (
                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold pr-4" style={{ color: 'var(--text-primary)' }}>
                              {article.title}
                            </h3>

                            {/* Status Badge */}
                            <div className="flex-shrink-0">
                              {article.status === 'pending' && (
                                <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
                                  Aguardando
                                </span>
                              )}
                              {article.status === 'generating' && (
                                <span className="text-xs px-3 py-1 rounded-full flex items-center gap-2" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
                                  <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 animate-spin" />
                                  Gerando...
                                </span>
                              )}
                              {article.status === 'success' && (
                                <span className="text-xs px-3 py-1 rounded-full flex items-center gap-2" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                                  <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
                                  Pronto
                                </span>
                              )}
                              {article.status === 'error' && (
                                <span className="text-xs px-3 py-1 rounded-full flex items-center gap-2" style={{ backgroundColor: '#ef444415', color: '#ef4444' }}>
                                  <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3" />
                                  Erro
                                </span>
                              )}
                            </div>
                          </div>

                          {article.excerpt && (
                            <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                              {article.excerpt}
                            </p>
                          )}

                          {article.status === 'success' && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {article.category && (
                                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
                                  {article.category}
                                </span>
                              )}
                              {article.citations && article.citations.length > 0 && (
                                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
                                  {article.citations.length} fontes
                                </span>
                              )}
                            </div>
                          )}

                          {article.error && (
                            <div className="mt-3 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#ef444410' }}>
                              <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-red-600">{article.error}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (confirm('Descartar todos os artigos gerados?')) {
                      setArticles([]);
                      setCurrentStep(0);
                      setTotalSteps(0);
                    }
                  }}
                  disabled={isGenerating}
                  className="flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '2px solid var(--border-medium)'
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} className="w-5 h-5 mr-2" />
                  Descartar Todos
                </button>

                <button
                  onClick={saveSelectedArticles}
                  disabled={isGenerating || selectedCount === 0}
                  className="flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <FontAwesomeIcon icon={faDatabase} className="w-5 h-5" />
                  Salvar {selectedCount} {selectedCount === 1 ? 'Artigo' : 'Artigos'} Selecionado{selectedCount !== 1 ? 's' : ''}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
