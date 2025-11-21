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
  faBolt,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';
import { processArticleLocally, validateProcessedArticle } from '@/lib/article-processor-client';
import { validateArticle } from '@/app/dashboard/criar-artigo/_lib/validation';
import type { ArticleType } from '@/app/dashboard/criar-artigo/_lib/constants';
import { normalizeCategoryWithFallback } from '@/app/dashboard/criar-artigo/_lib/constants';

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
  // Resource fields
  name?: string;
  slug?: string;
  shortDescription?: string;
  officialUrl?: string;
  platforms?: string[];
  heroTitle?: string;
  heroDescription?: string;
  heroGradient?: string;
  whyGoodTitle?: string;
  whyGoodContent?: string[];
  features?: any[];
  howToStartTitle?: string;
  howToStartSteps?: any[];
  pros?: string[];
  cons?: string[];
  faq?: any[];
  securityTips?: any[];
  relatedResources?: string[];
}

export default function GerarEmMassaPage() {
  const [contentType, setContentType] = useState<'news' | 'educational' | 'resource'>('news');
  const [quantity, setQuantity] = useState(5);
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchingTopics, setSearchingTopics] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [foundTopics, setFoundTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Set<number>>(new Set());

  /**
   * Busca tópicos relevantes e atuais em tempo real via Perplexity
   * Para RECURSOS: busca itens existentes ANTES para informar à IA
   */
  const searchRelevantTopics = async (type: 'news' | 'educational' | 'resource', count: number): Promise<string[]> => {
    try {
      setSearchingTopics(true);
      console.log(`🔍 Buscando ${count} tópicos relevantes de ${type}...`);

      // Para RECURSOS: buscar existentes ANTES e passar à IA
      let existingNames: string[] = [];
      if (type === 'resource') {
        try {
          const response = await fetch('/api/resources');
          if (response.ok) {
            const result = await response.json();
            const existing = result.data || result;
            if (Array.isArray(existing)) {
              existingNames = existing.map((item: any) => item.name || '').filter(Boolean);
              console.log(`📋 ${existingNames.length} recursos já existentes:`, existingNames.slice(0, 10));
            }
          }
        } catch (e) {
          console.warn('⚠️ Não foi possível buscar recursos existentes, continuando...');
        }
      }

      const prompts: Record<string, string> = {
        news: `Liste ${count} tópicos de notícias RECENTES (últimas 24-48h) sobre criptomoedas que sejam relevantes e de alto impacto.

Responda APENAS com um JSON array de strings, sem markdown:
["Tópico 1", "Tópico 2", ...]

Exemplos do que buscar:
- Movimentos de preço significativos (Bitcoin, Ethereum, etc)
- Novidades regulatórias importantes
- Grandes empresas adotando cripto
- Atualizações técnicas em blockchains populares
- DeFi, NFTs, eventos de mercado

IMPORTANTE: Apenas tópicos factuais e atuais, nada genérico.`,

        educational: `Liste ${count} tópicos educacionais sobre criptomoedas que ainda não estão bem cobertos ou são muito demandados.

Responda APENAS com um JSON array de strings, sem markdown:
["Tópico 1", "Tópico 2", ...]

Categorias:
- Conceitos fundamentais (blockchain, wallets, etc)
- Trading e análise técnica
- DeFi e protocolos
- Segurança e boas práticas
- Desenvolvimento e tecnologia

IMPORTANTE: Tópicos práticos e úteis para iniciantes/intermediários.`,

        resource: existingNames.length > 0
          ? `Liste ${count * 2} ferramentas/recursos do ecossistema cripto que sejam essenciais e amplamente usados.

🚨 IMPORTANTE: Os seguintes recursos JÁ EXISTEM no banco. NÃO os sugira:
${existingNames.map(name => `- ${name}`).join('\n')}

Responda APENAS com um JSON array de strings no formato "Nome: Descrição breve":
["Nome: Descrição", ...]

Categorias de recursos para sugerir (evite os da lista acima):
- Wallets: Exodus, SafePal, Argent, Rainbow Wallet, Rabby
- Exchanges CEX: KuCoin, Kraken, OKX, Bybit, Gate.io
- Exchanges DEX: PancakeSwap, SushiSwap, Curve Finance
- DeFi: Aave, Compound, Yearn Finance, Lido
- Browsers: Opera Crypto, Puma Browser
- Analytics: Nansen, Dune Analytics, Messari, Token Terminal
- Explorers: BscScan, PolygonScan, Solscan, Arbiscan
- Portfolio: DeBank, CoinStats, Delta, Zerion

CRÍTICO:
- NÃO repita nenhum recurso da lista de exclusão
- Sugira alternativas relevantes mas menos óbvias
- Apenas ferramentas confiáveis e verificadas`
          : `Liste ${count} ferramentas/recursos populares do ecossistema cripto que sejam essenciais e amplamente usados.

Responda APENAS com um JSON array de strings no formato "Nome: Descrição breve":
["MetaMask: Carteira Ethereum essencial", "Binance: Exchange líder global", ...]

Categorias:
- Wallets (hot/cold)
- Exchanges (CEX/DEX)
- Ferramentas DeFi
- Browsers Web3
- Analytics e rastreamento
- Exploradores de blockchain

IMPORTANTE: Apenas ferramentas confiáveis e verificadas.`
      };

      const response = await fetch('/api/chat-perplexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompts[type] }],
          articleType: null // Modo conversa
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar tópicos');
      }

      // Ler stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
      }

      console.log('📥 Resposta recebida:', fullText.substring(0, 300));

      // Extrair JSON do texto
      const jsonMatch = fullText.match(/\[[\s\S]*?\]/);
      if (!jsonMatch) {
        throw new Error('Formato de resposta inválido');
      }

      const topics = JSON.parse(jsonMatch[0]);
      console.log(`✅ ${topics.length} tópicos encontrados (pré-slice):`, topics);

      // Para recursos com lista de exclusão, não limitar ainda (precisamos de buffer para duplicados)
      // Para outros tipos, limitar ao número solicitado
      const shouldLimit = type !== 'resource' || existingNames.length === 0;
      const limitedTopics = shouldLimit ? topics.slice(0, count) : topics;
      console.log(`✅ ${limitedTopics.length} tópicos após limitar:`, limitedTopics);

      return limitedTopics;

    } catch (error: any) {
      console.error('❌ Erro ao buscar tópicos:', error);
      throw error;
    } finally {
      setSearchingTopics(false);
    }
  };

  /**
   * Verifica se já existem artigos com títulos/slugs similares no banco
   */
  const checkDuplicates = async (topics: string[], type: 'news' | 'educational' | 'resource'): Promise<string[]> => {
    try {
      console.log('🔍 Verificando duplicados no banco...');

      const endpoint = type === 'resource' ? '/api/resources' : '/api/articles';
      const response = await fetch(endpoint);

      if (!response.ok) {
        console.warn('⚠️ Não foi possível verificar duplicados, continuando...');
        return topics;
      }

      const result = await response.json();

      // APIs retornam { success: true, data: [...] } ou { data: [...] }
      const existing = result.data || result;

      console.log(`📊 ${existing.length} itens existentes no banco`);

      // Verificar se é array (proteção contra erros)
      if (!Array.isArray(existing)) {
        console.warn('⚠️ Resposta da API não é um array, continuando sem filtrar duplicados');
        return topics;
      }

      // Armazenar slugs existentes para verificação rápida
      const existingSlugs = new Set(existing.map((item: any) => item.slug).filter(Boolean));

      // Filtrar tópicos que já existem (comparação por similaridade de título E slug)
      const filtered = topics.filter(topic => {
        const topicLower = topic.toLowerCase();

        // Gerar slug do tópico para verificar duplicação exata
        const topicSlug = topicLower
          .split(':')[0] // Pega só o nome antes dos dois pontos (ex: "MetaMask: descrição" -> "MetaMask")
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
          .replace(/\s+/g, '-') // Substitui espaços por hífens
          .replace(/-+/g, '-') // Remove hífens duplicados
          .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim

        // Verifica se slug já existe
        if (existingSlugs.has(topicSlug)) {
          console.log(`⚠️ Slug duplicado ignorado: "${topic}" (slug: "${topicSlug}")`);
          return false;
        }

        // Verifica similaridade de título
        const isDuplicate = existing.some((item: any) => {
          const title = (item.title || item.name || '').toLowerCase();
          // Considera duplicado se 70%+ das palavras são iguais
          const topicWords = topicLower.split(/\s+/);
          const titleWords = title.split(/\s+/);
          const matchCount = topicWords.filter(w => titleWords.includes(w)).length;
          const similarity = matchCount / Math.max(topicWords.length, titleWords.length);
          return similarity > 0.7;
        });

        if (isDuplicate) {
          console.log(`⚠️ Tópico similar ignorado: "${topic}"`);
        }
        return !isDuplicate;
      });

      console.log(`✅ ${filtered.length} tópicos únicos após filtrar duplicados`);
      return filtered;

    } catch (error) {
      console.error('❌ Erro ao verificar duplicados:', error);
      return topics; // Em caso de erro, retorna todos
    }
  };

  /**
   * PASSO 1: Buscar tópicos e mostrar para confirmação
   */
  const searchAndShowTopics = async () => {
    try {
      setSearchingTopics(true);
      setFoundTopics([]);
      setSelectedTopics(new Set());

      // 1. Buscar tópicos relevantes em tempo real
      console.log(`🔍 Buscando exatamente ${quantity} tópicos de ${contentType}...`);
      const topics = await searchRelevantTopics(contentType, quantity);

      if (topics.length === 0) {
        alert('❌ Nenhum tópico encontrado. Tente novamente.');
        return;
      }

      // 2. Verificar duplicados
      const uniqueTopics = await checkDuplicates(topics, contentType);

      if (uniqueTopics.length === 0) {
        alert('⚠️ Todos os tópicos encontrados já existem no banco. Tente gerar novamente para obter tópicos diferentes.');
        return;
      }

      // 3. Limitar à quantidade solicitada (pode ter vindo mais por causa do buffer)
      const finalTopics = uniqueTopics.slice(0, quantity);
      console.log(`✅ Mostrando ${finalTopics.length} tópicos (${uniqueTopics.length} únicos encontrados)`);

      // 4. Mostrar tópicos para confirmação
      setFoundTopics(finalTopics);
      // Selecionar todos por padrão
      setSelectedTopics(new Set(finalTopics.map((_, i) => i)));

    } catch (error: any) {
      console.error('❌ Erro ao buscar tópicos:', error);
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setSearchingTopics(false);
    }
  };

  /**
   * PASSO 2: Gerar artigos confirmados
   */
  const confirmAndGenerate = async () => {
    try {
      setIsGenerating(true);
      setArticles([]);
      setCurrentStep(0);

      // Pegar apenas tópicos selecionados
      const topicsToGenerate = foundTopics.filter((_, index) => selectedTopics.has(index));

      if (topicsToGenerate.length === 0) {
        alert('Selecione pelo menos um tópico para gerar!');
        setIsGenerating(false);
        return;
      }

      console.log(`🚀 Gerando ${topicsToGenerate.length} artigos confirmados...`);

      // 1. Criar artigos pendentes
      setTotalSteps(topicsToGenerate.length);
      const newArticles: GeneratedArticle[] = topicsToGenerate.map((topic, index) => ({
        id: `article-${Date.now()}-${index}`,
        type: contentType,
        title: topic,
        selected: true,
        status: 'pending'
      }));

      setArticles(newArticles);

      // 2. Gerar artigos sequencialmente
      for (let i = 0; i < newArticles.length; i++) {
        setCurrentStep(i + 1);
        await generateSingleArticle(newArticles[i], i);
        await sleep(2000); // Delay de 2s entre requisições
      }

      // 3. Limpar tópicos encontrados após geração
      setFoundTopics([]);
      setSelectedTopics(new Set());

    } catch (error: any) {
      console.error('❌ Erro ao gerar artigos:', error);
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Toggle seleção de tópico
   */
  const toggleTopicSelection = (index: number) => {
    setSelectedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  /**
   * Gera um único artigo com o mesmo processamento de criar-artigo
   */
  const generateSingleArticle = async (article: GeneratedArticle, index: number) => {
    try {
      // Atualizar status para "generating"
      setArticles(prev => prev.map(a =>
        a.id === article.id ? { ...a, status: 'generating' } : a
      ));

      console.log(`🚀 [${index + 1}] Gerando: ${article.title}`);

      // 1. Chamar Perplexity (mesmo endpoint de criar-artigo)
      const response = await fetch('/api/chat-perplexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: article.title }],
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

      // 2. Extrair JSON do content (mesmo método de usePerplexityChat)
      let rawArticle;
      try {
        // Tentar extrair JSON de code block markdown
        const jsonMatch = data.content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1].trim() : data.content.trim();

        console.log(`📄 [${index + 1}] JSON extraído (preview):`, jsonString.substring(0, 200));

        // Tentar parsear JSON - se falhar, tentar reparar JSON truncado
        try {
          rawArticle = JSON.parse(jsonString);
        } catch (parseError) {
          console.warn(`⚠️ [${index + 1}] JSON malformado, tentando reparar...`);

          // Tentar reparar JSON truncado (ex: arrays incompletos, strings abertas)
          let repairedJson = jsonString;

          // Se termina com vírgula ou string aberta, tentar fechar apropriadamente
          if (!repairedJson.trim().endsWith('}')) {
            // Encontrar a última chave aberta para fechar corretamente
            const openBraces = (repairedJson.match(/{/g) || []).length;
            const closeBraces = (repairedJson.match(/}/g) || []).length;
            const openBrackets = (repairedJson.match(/\[/g) || []).length;
            const closeBrackets = (repairedJson.match(/\]/g) || []).length;

            // Fechar strings abertas
            const doubleQuotes = (repairedJson.match(/"/g) || []).length;
            if (doubleQuotes % 2 !== 0) {
              repairedJson += '"';
            }

            // Fechar arrays e objetos abertos
            for (let i = 0; i < (openBrackets - closeBrackets); i++) {
              repairedJson += ']';
            }
            for (let i = 0; i < (openBraces - closeBraces); i++) {
              repairedJson += '}';
            }
          }

          try {
            rawArticle = JSON.parse(repairedJson);
            console.log(`✅ [${index + 1}] JSON reparado com sucesso!`);
          } catch (repairError) {
            // Se ainda falhar, este item será pulado
            console.error(`❌ [${index + 1}] Não foi possível reparar o JSON`);
            throw repairError;
          }
        }
      } catch (e) {
        console.error(`❌ [${index + 1}] Erro ao parsear JSON:`, e);
        console.error(`📄 [${index + 1}] Conteúdo recebido:`, data.content.substring(0, 500));
        throw new Error('Resposta da IA não está em formato JSON válido');
      }

      // 3. Processar artigo (MESMA LÓGICA de criar-artigo)
      const processedArticle = processArticleLocally(rawArticle, article.type as ArticleType);
      console.log(`🔧 [${index + 1}] Artigo processado:`, Object.keys(processedArticle));

      // 4. Validar estrutura (MESMA LÓGICA de criar-artigo)
      const clientValidation = validateProcessedArticle(processedArticle, article.type as ArticleType);
      if (!clientValidation.valid) {
        console.warn(`⚠️ [${index + 1}] Validação client-side falhou:`, clientValidation.errors);
      }

      // 4.5. NOVO: Aplicar fallback de categoria ANTES da validação Zod (P0 - Blindagem)
      const { category: normalizedCategory, hadFallback } = normalizeCategoryWithFallback(
        processedArticle.category,
        article.type as ArticleType
      );

      processedArticle.category = normalizedCategory;

      if (hadFallback) {
        console.warn(`⚠️ [${index + 1}] Categoria normalizada:`, {
          original: processedArticle.category,
          normalizada: normalizedCategory,
          tipo: article.type
        });
      }

      // 5. Validação Zod (MESMA LÓGICA de criar-artigo)
      const zodValidation = validateArticle(processedArticle, article.type as ArticleType);
      if (!zodValidation.success) {
        console.error(`❌ [${index + 1}] Validação Zod falhou:`, zodValidation.errors);
        throw new Error(`Validação falhou:\n${zodValidation.errors.join('\n')}`);
      }

      console.log(`✅ [${index + 1}] Validação OK:`, {
        title: processedArticle.title || processedArticle.name,
        category: processedArticle.category,
        hasContent: !!processedArticle.content,
        citations: data.citations?.length || 0
      });

      // 6. Atualizar artigo com dados validados
      setArticles(prev => prev.map(a =>
        a.id === article.id ? {
          ...a,
          ...processedArticle,
          citations: data.citations || [],
          status: 'success'
        } : a
      ));

      console.log(`✅ [${index + 1}] Gerado com sucesso!`);

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

  /**
   * Salva artigos selecionados (MESMA LÓGICA de criar-artigo)
   */
  const saveSelectedArticles = async () => {
    const selected = articles.filter(a => a.selected && a.status === 'success');

    if (selected.length === 0) {
      alert('Selecione pelo menos um artigo para salvar!');
      return;
    }

    setIsGenerating(true);

    try {
      for (let i = 0; i < selected.length; i++) {
        const article = selected[i];
        console.log(`💾 [${i + 1}/${selected.length}] Salvando: ${article.title || article.name}`);

        // FIX: Aplicar fallback robusto de categoria para TODOS os tipos (P0)
        // Substitui normalização manual por função centralizada
        const { category: normalizedCategory, hadFallback } = normalizeCategoryWithFallback(
          article.category,
          contentType
        );

        const articleToSave = {
          ...article,
          category: normalizedCategory
        };

        if (hadFallback) {
          console.warn(`⚠️ [${i + 1}] Categoria do artigo normalizada ao salvar:`, {
            original: article.category,
            normalizada: normalizedCategory,
            tipo: contentType
          });
        }

        const apiEndpoint = contentType === 'resource' ? '/api/resources' : '/api/articles';

        // Normalizar tags: garantir que seja array de strings
        let tagsToSend: string[] = [];
        if (typeof articleToSave.tags === 'string') {
          try {
            tagsToSend = JSON.parse(articleToSave.tags);
          } catch {
            tagsToSend = [articleToSave.tags]; // Se não for JSON válido, usar como array de 1 item
          }
        } else if (Array.isArray(articleToSave.tags)) {
          tagsToSend = articleToSave.tags;
        }

        // Normalizar citations: garantir que seja array de strings (URLs)
        let citationsToSend: string[] | undefined = undefined;
        if (articleToSave.citations && articleToSave.citations.length > 0) {
          // citations já é array de objetos {url, title}, extrair apenas URLs
          citationsToSend = articleToSave.citations.map((c: any) =>
            typeof c === 'string' ? c : c.url
          );
        }

        // Criar payload com tipo flexível para aceitar conversões
        const payload: any = {
          ...articleToSave,
          type: contentType, // GARANTIR que o tipo seja enviado
          tags: tagsToSend.length > 0 ? tagsToSend : undefined,
          factCheckSources: citationsToSend,
          published: true
        };

        // Campos específicos para recursos
        if (contentType === 'resource') {
          // NOTA: Não stringificar campos JSON, pois o Zod schema espera arrays/objetos
          // O Service layer cuidará da conversão para o banco se necessário

          // NOTA: Campo 'sources' foi removido porque a coluna não existe no banco Supabase
          // Citations são armazenadas em factCheckSources (apenas para artigos)
          payload.verified = true;
        }

        // Remover campos internos
        delete payload.id;
        delete payload.selected;
        delete payload.status;
        delete payload.error;
        delete payload.citations;

        console.log(`📦 [${i + 1}] Payload:`, {
          type: payload.type,
          title: payload.title || payload.name,
          category: payload.category,
          slug: payload.slug
        });

        const response = await fetch(apiEndpoint, {
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
          throw new Error(`Erro ao salvar "${article.title || article.name}": ${errorMessage}`);
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
                  Custo estimado: ~${(quantity * 0.008 * 2).toFixed(3)} USD (busca de tópicos + geração)
                </p>
              </div>

              {/* Info Box */}
              <div
                className="rounded-lg p-4 mb-6"
                style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid var(--brand-primary)' }}
              >
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faSearch} className="w-5 h-5 mt-0.5" style={{ color: 'var(--brand-primary)' }} />
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Busca Inteligente de Tópicos
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      A IA buscará tópicos <strong>relevantes e atuais</strong> em tempo real, verificando duplicados no banco de dados antes de gerar.
                    </p>
                    <ul className="mt-2 space-y-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      <li>✅ Notícias das últimas 24-48h</li>
                      <li>✅ Artigos educacionais demandados</li>
                      <li>✅ Recursos populares e verificados</li>
                      <li>✅ Validação completa (mesma qualidade de criar-artigo)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Search Topics Button */}
              <button
                onClick={searchAndShowTopics}
                disabled={isGenerating || searchingTopics}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)'
                }}
              >
                {searchingTopics ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="w-6 h-6 animate-spin" />
                    Buscando Tópicos Relevantes...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSearch} className="w-6 h-6" />
                    Buscar {quantity} Tópicos de {getTypeConfig(contentType).label}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Topics Confirmation Panel */}
          {foundTopics.length > 0 && articles.length === 0 && (
            <div
              className="rounded-2xl p-8 border shadow-lg mb-8"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Tópicos Encontrados ({foundTopics.length})
                </h2>
                <button
                  onClick={() => {
                    setFoundTopics([]);
                    setSelectedTopics(new Set());
                  }}
                  className="text-sm px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                  Buscar Novamente
                </button>
              </div>

              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Selecione os tópicos que deseja gerar. Todos estão selecionados por padrão.
              </p>

              {/* Topics List */}
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {foundTopics.map((topic, index) => {
                  const isSelected = selectedTopics.has(index);
                  const config = getTypeConfig(contentType);

                  return (
                    <div
                      key={index}
                      onClick={() => toggleTopicSelection(index)}
                      className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        backgroundColor: isSelected ? `${config.color}10` : 'var(--bg-secondary)',
                        borderColor: isSelected ? config.color : 'var(--border-light)',
                        boxShadow: isSelected ? `0 0 15px ${config.color}20` : 'none'
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                        style={{
                          borderColor: isSelected ? config.color : 'var(--border-medium)',
                          backgroundColor: isSelected ? config.color : 'transparent'
                        }}
                      >
                        {isSelected && (
                          <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: isSelected ? config.color : 'var(--text-primary)' }}>
                          {topic}
                        </p>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded flex-shrink-0"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-tertiary)'
                        }}
                      >
                        #{index + 1}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <strong>{selectedTopics.size}</strong> de <strong>{foundTopics.length}</strong> tópicos selecionados
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    Custo estimado: ~${(selectedTopics.size * 0.008).toFixed(3)} USD
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (selectedTopics.size === foundTopics.length) {
                      setSelectedTopics(new Set());
                    } else {
                      setSelectedTopics(new Set(foundTopics.map((_, i) => i)));
                    }
                  }}
                  className="text-sm px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: 'var(--brand-primary)',
                    color: 'white'
                  }}
                >
                  {selectedTopics.size === foundTopics.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>

              {/* Confirm Button */}
              <button
                onClick={confirmAndGenerate}
                disabled={selectedTopics.size === 0}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                }}
              >
                <FontAwesomeIcon icon={faBolt} className="w-6 h-6" />
                Gerar {selectedTopics.size} {selectedTopics.size === 1 ? 'Artigo' : 'Artigos'}
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
