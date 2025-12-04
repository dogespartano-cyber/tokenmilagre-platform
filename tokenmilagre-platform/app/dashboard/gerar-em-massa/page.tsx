'use client';

import { useState, useEffect } from 'react';
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
import { processArticleLocally, validateProcessedArticle, generateSlug } from '@/lib/article-processor-client';
import { validateArticle } from '@/app/dashboard/criar-artigo/_lib/validation';
import type { ArticleType } from '@/app/dashboard/criar-artigo/_lib/constants';
import { normalizeCategoryWithFallback } from '@/app/dashboard/criar-artigo/_lib/constants';
import { DraftStorageService } from '@/lib/draft-storage';

interface GeneratedArticle {
  id: string;
  type: 'news' | 'educational' | 'resource';
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  citations?: any[];
  quiz?: any[]; // Quiz data
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
  const [hasDrafts, setHasDrafts] = useState(false);

  // 🔄 RECUPERAR rascunhos ao carregar página ou trocar tipo
  useEffect(() => {
    const drafts = DraftStorageService.getDraftsByType(contentType);
    setHasDrafts(drafts.length > 0);

    if (drafts.length > 0 && articles.length === 0) {
      const shouldRecover = confirm(
        `🔄 Encontrados ${drafts.length} rascunho(s) salvos de ${contentType}.\n\nDeseja recuperá-los? Isso vai economizar chamadas à API.`
      );

      if (shouldRecover) {
        const recovered: GeneratedArticle[] = drafts.map(draft => {
          const article = {
            id: draft.id,
            type: draft.type,
            ...draft.data,
            selected: true,
            status: 'success' as const,
            error: draft.error
          };

          // 🔒 BLINDAGEM: Corrigir categoria se vier como objeto do cache
          if (article.category && typeof article.category === 'object') {
            const categoryObj = article.category as any;
            article.category = categoryObj.category || categoryObj.name || undefined;
            console.warn(`⚠️ Categoria corrigida do rascunho ${draft.id}:`, article.category);
          }

          // 🔧 REGENERAR slug para usar novo formato (timestamp em vez de data)
          if (article.title) {
            // Usa a função centralizada que já tem a correção para não deixar hífen no final
            article.slug = generateSlug(article.title, true);
            console.log(`🔧 Slug regenerado: ${article.slug}`);
          }

          return article;
        });

        setArticles(recovered);
        console.log(`✅ ${recovered.length} rascunhos recuperados`);
      }
    }
  }, [contentType]); // Executar ao trocar tipo de conteúdo

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
      // 🔒 BLINDAGEM: Garantir que category seja sempre uma string válida
      let rawCategory = processedArticle.category;
      if (typeof rawCategory === 'object' && rawCategory !== null) {
        // Se a IA retornou um objeto por engano, tentar extrair string
        rawCategory = (rawCategory as any).category || (rawCategory as any).name || undefined;
        console.warn(`⚠️ [${index + 1}] Categoria veio como objeto da IA, extraído:`, rawCategory);
      }

      const { category: normalizedCategory, hadFallback } = normalizeCategoryWithFallback(
        rawCategory,
        article.type as ArticleType
      );

      processedArticle.category = normalizedCategory;

      if (hadFallback) {
        console.warn(`⚠️ [${index + 1}] Categoria normalizada:`, {
          original: rawCategory,
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

      // 💾 SALVAR RASCUNHO após geração bem-sucedida (ANTES de tentar salvar no banco)
      DraftStorageService.saveDraft(
        { ...processedArticle, citations: data.citations || [] },
        article.type
      );

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

      // 💾 SALVAR RASCUNHO com erro para debugging posterior
      DraftStorageService.saveDraft(article, article.type, error.message);

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
   * Corrige campos problemáticos de um artigo usando Gemini
   * IMPORTANTE: Só corrige o campo específico, não reescreve o artigo
   */
  const handleFixWithAI = async (article: GeneratedArticle) => {
    try {
      setIsGenerating(true);

      // Identificar qual campo precisa ser corrigido
      const needsContent = !article.content || article.content.length < 100;
      const needsExcerpt = !article.excerpt || article.excerpt.length < 50 || article.excerpt.length > 300;

      console.log(`🤖 Corrigindo artigo "${article.title}" com Gemini:`, {
        needsContent,
        needsExcerpt
      });

      // Construir prompt CIRÚRGICO - apenas para o campo problemático
      let refinementPrompt = '';
      let fieldToFix = '';

      if (needsContent) {
        fieldToFix = 'content';
        refinementPrompt = `GERE APENAS o campo "content" para este artigo.

**INSTRUÇÕES CRÍTICAS:**
- Crie um artigo completo e informativo sobre: "${article.title}"
- Mínimo 500 caracteres, máximo 5000 caracteres
- Use formato Markdown com seções ## (H2)
- Estrutura: Introdução → Contexto → Análise → Conclusão
- Seja profissional e objetivo
- NÃO inclua título H1 no início (# Título)
- NÃO inclua seção de fontes/referências ao final
- NÃO altere outros campos (title, excerpt, category, tags, etc)
- Preserve TODOS os outros campos existentes

APENAS GERE O CAMPO "content". NÃO REESCREVA O ARTIGO INTEIRO.`;
      } else if (needsExcerpt) {
        fieldToFix = 'excerpt';
        refinementPrompt = `GERE APENAS o campo "excerpt" para este artigo.

**INSTRUÇÕES CRÍTICAS:**
- Crie um resumo conciso e atrativo
- Mínimo 50 caracteres, máximo 300 caracteres
- Seja objetivo e profissional
- NÃO altere outros campos (title, content, category, tags, etc)
- Preserve TODOS os outros campos existentes

APENAS GERE O CAMPO "excerpt". NÃO REESCREVA O ARTIGO INTEIRO.`;
      }

      // Chamar endpoint /api/refine-article (mesmo que página criar-artigo usa)
      const response = await fetch('/api/refine-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: article,
          refinementPrompt: refinementPrompt,
          articleType: article.type || 'news'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao chamar /api/refine-article:', errorData);
        throw new Error(errorData.error || 'Erro ao chamar Gemini');
      }

      const data = await response.json();
      const refinedArticle = data.article;

      if (!refinedArticle || !refinedArticle[fieldToFix]) {
        console.error('Gemini não gerou o campo:', fieldToFix);
        console.error('Resposta:', refinedArticle);
        throw new Error(`Gemini não gerou o campo "${fieldToFix}"`);
      }

      // Atualizar APENAS o campo corrigido, preservando tudo mais
      const updatedArticle = {
        ...article,
        [fieldToFix]: refinedArticle[fieldToFix],
        status: 'success' as const,
        error: undefined
      };

      // Atualizar no state
      setArticles(prev => prev.map(a =>
        a.id === article.id ? updatedArticle : a
      ));

      // Salvar no draft storage
      DraftStorageService.saveDraft(updatedArticle, article.type);

      console.log(`✅ Campo "${fieldToFix}" corrigido com sucesso!`, {
        original: article[fieldToFix as keyof GeneratedArticle],
        fixed: refinedArticle[fieldToFix]
      });

      alert(`✅ Campo "${fieldToFix}" corrigido com sucesso!\n\nAgora você pode tentar salvar novamente.`);

    } catch (error: any) {
      console.error('❌ Erro ao corrigir com IA:', error);
      alert(`❌ Erro ao corrigir: ${error.message}\n\nTente novamente ou corrija manualmente.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const discardAll = () => {
    if (confirm('Descartar todos os artigos gerados?')) {
      setArticles([]);
      setCurrentStep(0);
      setTotalSteps(0);
      setFoundTopics([]);
      setSelectedTopics(new Set());
    }
  };

  const saveSelectedArticles = async () => {
    const selected = articles.filter(a => a.selected && a.status === 'success');

    if (selected.length === 0) {
      alert('Selecione pelo menos um artigo para salvar!');
      return;
    }

    setIsGenerating(true);
    const successfulSlugs: string[] = []; // 📝 Rastrear artigos salvos com sucesso

    try {
      for (let i = 0; i < selected.length; i++) {
        const article = selected[i];
        console.log(`💾 [${i + 1}/${selected.length}] Salvando: ${article.title || article.name}`);

        // 🔒 BLINDAGEM: Garantir que category seja sempre uma string válida
        // Pode vir como objeto se houve erro de parsing/cache
        let rawCategory = article.category;
        if (typeof rawCategory === 'object' && rawCategory !== null) {
          // Se veio como objeto (ex: { category: string, hadFallback: boolean }), extrair a string
          rawCategory = (rawCategory as any).category || undefined;
          console.warn(`⚠️ [${i + 1}] Categoria veio como objeto, extraído:`, rawCategory);
        }

        // FIX: Aplicar fallback robusto de categoria para TODOS os tipos (P0)
        // Substitui normalização manual por função centralizada
        const { category: normalizedCategory, hadFallback } = normalizeCategoryWithFallback(
          rawCategory,
          contentType
        );

        const articleToSave = {
          ...article,
          category: normalizedCategory
        };

        if (hadFallback) {
          console.warn(`⚠️ [${i + 1}] Categoria do artigo normalizada ao salvar:`, {
            original: rawCategory,
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
          quizData: articleToSave.quiz, // Include quiz data
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

        // 🔒 VALIDAÇÃO FINAL: Garantir que category é string antes de enviar
        if (payload.category && typeof payload.category !== 'string') {
          console.error(`❌ [${i + 1}] ERRO CRÍTICO: category não é string:`, payload.category);
          throw new Error(`Categoria inválida: esperado string, recebido ${typeof payload.category}`);
        }

        // 🔧 AUTO-CORREÇÃO: Truncar campos que excedem limites de validação
        let wasCorrected = false;

        // 🔒 Excerpt: garantir que existe e está dentro do limite
        // Função auxiliar para gerar excerpt do conteúdo
        const generateExcerptFromContent = (content: string): string => {
          // Remove títulos markdown e divide em parágrafos
          const paragraphs = content
            .replace(/^#+\s+.*$/gm, '') // Remove títulos markdown
            .split(/\n\n+/) // Divide por múltiplas quebras de linha
            .map(p => p
              .replace(/[#*_`\[\]]/g, '') // Remove markdown
              .replace(/\n/g, ' ') // Substitui quebras por espaços
              .trim()
            )
            .filter(p => p.length > 0); // Remove parágrafos vazios

          // Pega o primeiro parágrafo válido (com pelo menos 30 caracteres)
          const validParagraph = paragraphs.find(p => p.length >= 30);

          if (validParagraph) {
            return validParagraph.substring(0, 297) + '...';
          }

          // Se não encontrou parágrafo válido, concatena o que tiver
          const allText = paragraphs.join(' ').substring(0, 297);
          return allText.length > 10 ? allText + '...' : '';
        };

        if (!payload.excerpt || typeof payload.excerpt !== 'string') {
          // Se excerpt está faltando ou inválido, gerar a partir do content
          if (payload.content && typeof payload.content === 'string') {
            const generatedExcerpt = generateExcerptFromContent(payload.content);

            if (generatedExcerpt.length >= 50) {
              payload.excerpt = generatedExcerpt;
              console.warn(`⚠️ [${i + 1}] Excerpt gerado do conteúdo: ${payload.excerpt.length} chars`);
              wasCorrected = true;
            } else {
              // Fallback: usar título como excerpt
              payload.excerpt = (payload.title || 'Artigo gerado por IA').substring(0, 297) + '...';
              console.warn(`⚠️ [${i + 1}] Excerpt gerado do título (fallback - conteúdo inválido)`);
              wasCorrected = true;
            }
          } else {
            // Fallback: usar título como excerpt
            payload.excerpt = (payload.title || 'Artigo gerado por IA').substring(0, 297) + '...';
            console.warn(`⚠️ [${i + 1}] Excerpt gerado do título (fallback - sem conteúdo)`);
            wasCorrected = true;
          }
        } else if (payload.excerpt.length > 300) {
          // Se excerpt existe mas é muito longo, truncar
          const originalLength = payload.excerpt.length;
          payload.excerpt = payload.excerpt.substring(0, 297) + '...';
          console.warn(`⚠️ [${i + 1}] Excerpt truncado: ${originalLength} → 300 chars`);
          wasCorrected = true;
        } else if (payload.excerpt.length < 50) {
          // Se excerpt é muito curto, tentar gerar do content
          if (payload.content && typeof payload.content === 'string') {
            const generatedExcerpt = generateExcerptFromContent(payload.content);

            if (generatedExcerpt.length >= 50) {
              payload.excerpt = generatedExcerpt;
              console.warn(`⚠️ [${i + 1}] Excerpt muito curto, regenerado do conteúdo: ${payload.excerpt.length} chars`);
              wasCorrected = true;
            } else {
              // Fallback: usar título
              payload.excerpt = (payload.title || 'Artigo gerado por IA').substring(0, 297) + '...';
              console.warn(`⚠️ [${i + 1}] Excerpt muito curto, usando título como fallback: ${payload.excerpt.length} chars`);
              wasCorrected = true;
            }
          }
        }

        // Title: máximo 200 caracteres (schema: min 10, max 200)
        if (payload.title && payload.title.length > 200) {
          const originalLength = payload.title.length;
          payload.title = payload.title.substring(0, 197) + '...';
          console.warn(`⚠️ [${i + 1}] Título truncado: ${originalLength} → 200 chars`);
          wasCorrected = true;
        }

        // Content: obrigatório e mínimo 100 caracteres (validação Zod)
        if (!payload.content || typeof payload.content !== 'string') {
          console.error(`❌ [${i + 1}] Conteúdo está faltando no rascunho`);

          // Marcar artigo como com erro para permitir correção com IA
          setArticles(prev => prev.map(a =>
            a.id === article.id ? {
              ...a,
              status: 'error',
              error: 'Campo "content" está faltando. Use "Corrigir com IA" para gerar o conteúdo automaticamente.'
            } : a
          ));

          throw new Error(`Campo obrigatório "content" está faltando. O rascunho está incompleto.\n\nUse o botão "Corrigir com IA" para gerar o conteúdo automaticamente.`);
        } else if (payload.content.length < 100) {
          console.error(`❌ [${i + 1}] Conteúdo muito curto: ${payload.content.length} chars (mínimo 100)`);

          // Marcar artigo como com erro
          setArticles(prev => prev.map(a =>
            a.id === article.id ? {
              ...a,
              status: 'error',
              error: `Conteúdo muito curto: ${payload.content.length} caracteres (mínimo 100). Use "Corrigir com IA".`
            } : a
          ));

          throw new Error(`Conteúdo insuficiente: ${payload.content.length} caracteres (mínimo 100).\n\nUse o botão "Corrigir com IA" para expandir o conteúdo.`);
        }

        if (wasCorrected) {
          console.log(`✅ [${i + 1}] Payload auto-corrigido e pronto para envio`);
        }

        console.log(`📦 [${i + 1}] Payload:`, {
          type: payload.type,
          title: payload.title || payload.name,
          titleLength: payload.title?.length,
          excerpt: payload.excerpt?.substring(0, 50) + '...',
          excerptLength: payload.excerpt?.length,
          category: payload.category,
          categoryType: typeof payload.category,
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

          // 🔍 Log detalhado do erro com payload completo
          console.error(`❌ [${i + 1}] Erro ao salvar:`, {
            status: response.status,
            error: errorMessage,
            details: errorData.details,
            validationErrors: errorData.validationErrors
          });

          console.error(`📦 [${i + 1}] Payload que falhou:`, JSON.stringify(payload, null, 2));

          // Se houver erros de validação específicos, mostrar claramente
          if (errorData.validationErrors && Array.isArray(errorData.validationErrors)) {
            const errorsText = errorData.validationErrors
              .map((e: any) => `${e.path}: ${e.message}`)
              .join('\n');
            throw new Error(`Validação falhou:\n${errorsText}`);
          }

          throw new Error(`Erro ao salvar "${article.title || article.name}": ${errorMessage}`);
        }

        const result = await response.json();
        console.log(`✅ [${i + 1}] Salvo com sucesso:`, result);

        // 📝 Adicionar slug à lista de bem-sucedidos
        if (article.slug) {
          successfulSlugs.push(article.slug);
        }
      }

      // 🗑️ LIMPAR rascunhos bem-sucedidos do localStorage
      if (successfulSlugs.length > 0) {
        DraftStorageService.clearSuccessful(successfulSlugs);
        console.log(`🗑️ ${successfulSlugs.length} rascunho(s) removido(s) do cache`);
      }

      alert(`✅ ${selected.length} artigo(s) salvos com sucesso!`);

      // Resetar
      setArticles([]);
      setCurrentStep(0);
      setTotalSteps(0);
      setHasDrafts(false); // Atualizar estado de rascunhos

    } catch (error: any) {
      console.error('❌ Erro detalhado ao salvar:', error);
      alert(`❌ Erro ao salvar artigos: ${error.message}\n\n💾 Rascunhos foram mantidos no cache. Você pode tentar novamente.`);
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
      <div className="min-h-screen relative">
        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
          {/* Header Removed */}

          {/* Configuration Panel */}
          {articles.length === 0 && (
            <div className="rounded-3xl p-8 border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl mb-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="w-1 h-8 bg-teal-500 rounded-full block"></span>
                    Configuração da Geração
                  </h2>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                    Voltar ao Dashboard
                  </Link>
                </div>

                {/* Type Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-4 text-gray-600 dark:text-gray-300 uppercase tracking-wider">
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
                          className={`group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden text-left ${isSelected
                            ? 'border-teal-500/50 bg-teal-500/10 shadow-[0_0_30px_rgba(20,184,166,0.1)]'
                            : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5'
                            }`}
                        >
                          <div className={`absolute inset-0 ${isSelected ? 'bg-teal-500/5' : 'bg-transparent'} transition-opacity duration-500`} />

                          <div className="relative z-10 flex flex-col gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 ${isSelected ? 'bg-teal-500 shadow-lg shadow-teal-500/30' : 'bg-gray-200 dark:bg-white/10'
                                }`}
                            >
                              <FontAwesomeIcon icon={config.icon} className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-white'}`} />
                            </div>
                            <div>
                              <span className={`block font-bold text-lg mb-1 ${isSelected ? 'text-teal-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                {config.label}
                              </span>
                              <span className="text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-400 transition-colors">
                                {type === 'news' && 'Notícias recentes e factuais'}
                                {type === 'educational' && 'Guias e conceitos explicativos'}
                                {type === 'resource' && 'Ferramentas e plataformas'}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Quantidade de Artigos
                    </label>
                    <span className="text-xs text-gray-500">
                      Custo estimado: <span className="text-teal-400 font-mono">~${(quantity * 0.008 * 2).toFixed(3)} USD</span>
                    </span>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/5 flex items-center gap-6">
                    <div className="flex-1 relative h-12 flex items-center">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 transition-all"
                      />
                    </div>
                    <div
                      className="w-24 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/20 border border-teal-500/30 shadow-inner"
                    >
                      <span className="text-3xl font-bold text-white font-[family-name:var(--font-poppins)]">
                        {quantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Box (Simplified) */}
                <div className="mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0 text-teal-500">
                      <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-teal-900 dark:text-white text-lg">
                        Busca Inteligente de Tópicos
                      </h3>
                      <p className="text-sm text-teal-800/70 dark:text-gray-400 mb-3 leading-relaxed">
                        A IA buscará tópicos <strong className="text-teal-600 dark:text-teal-300">relevantes e atuais</strong> em tempo real, verificando duplicados no banco de dados antes de gerar.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-teal-500/70" />
                          <span>Notícias das últimas 24-48h</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-teal-500/70" />
                          <span>Artigos educacionais demandados</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-teal-500/70" />
                          <span>Recursos populares e verificados</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-teal-500/70" />
                          <span>Validação completa</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Topics Button */}
                <div className="flex justify-start">
                  <button
                    onClick={searchAndShowTopics}
                    disabled={isGenerating || searchingTopics}
                    className="px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-lg shadow-teal-500/20 bg-teal-600 hover:bg-teal-500 text-white"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {searchingTopics ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="w-6 h-6 animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSearch} className="w-6 h-6" />
                          Buscar Tópicos
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Topics Confirmation Panel */}
          {foundTopics.length > 0 && articles.length === 0 && (
            <div className="rounded-3xl p-8 border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl mb-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-gray-900 dark:text-white flex items-center gap-3">
                      <span className="w-1 h-8 bg-teal-500 rounded-full block"></span>
                      Tópicos Encontrados ({foundTopics.length})
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-4">
                      Selecione os tópicos que deseja gerar.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setFoundTopics([]);
                        setSelectedTopics(new Set());
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 mr-2" />
                      Voltar
                    </button>

                    <button
                      onClick={() => {
                        if (selectedTopics.size === foundTopics.length) {
                          setSelectedTopics(new Set());
                        } else {
                          setSelectedTopics(new Set(foundTopics.map((_, i) => i)));
                        }
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 transition-all border border-teal-500/20 hover:border-teal-500/40"
                    >
                      {selectedTopics.size === foundTopics.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                    </button>
                  </div>
                </div>

                {/* Topics List - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {foundTopics.map((topic, index) => {
                    const isSelected = selectedTopics.has(index);
                    const config = getTypeConfig(contentType);

                    return (
                      <div
                        key={index}
                        onClick={() => toggleTopicSelection(index)}
                        className={`group relative p-5 rounded-xl border cursor-pointer transition-all duration-300 ${isSelected
                          ? 'border-teal-500/50 bg-teal-500/10 shadow-[0_0_20px_rgba(20,184,166,0.1)]'
                          : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/10'
                          }`}
                      >
                        <div className="flex items-start gap-3 relative z-10">
                          <div
                            className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isSelected
                              ? 'bg-teal-500 border-teal-500'
                              : 'bg-transparent border-gray-400 dark:border-gray-600 group-hover:border-gray-600 dark:group-hover:border-gray-400'
                              }`}
                          >
                            {isSelected && (
                              <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium text-sm leading-relaxed ${isSelected ? 'text-teal-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                              {topic}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-gray-600 group-hover:text-gray-500">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Selecionados
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedTopics.size} <span className="text-sm font-normal text-gray-500">/ {foundTopics.length}</span>
                      </p>
                    </div>
                    <div className="h-10 w-px bg-gray-200 dark:bg-white/10 mx-2" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Custo Estimado
                      </p>
                      <p className="text-lg font-mono text-teal-400">
                        ~${(selectedTopics.size * 0.008).toFixed(3)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={confirmAndGenerate}
                    disabled={selectedTopics.size === 0}
                    className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 bg-teal-600 hover:bg-teal-500 text-white"
                  >
                    <FontAwesomeIcon icon={faBolt} className="w-5 h-5" />
                    Gerar {selectedTopics.size} {selectedTopics.size === 1 ? 'Artigo' : 'Artigos'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isGenerating && totalSteps > 0 && (
            <div className="rounded-2xl p-6 border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl mb-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin text-teal-500 dark:text-teal-400" />
                  Gerando Artigos...
                </h3>
                <span className="text-sm font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  {currentStep} / {totalSteps}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden relative z-10">
                <div
                  className="h-full transition-all duration-500 relative"
                  style={{
                    width: `${(currentStep / totalSteps) * 100}%`,
                    background: '#14b8a6'
                  }}
                >
                  <div className="absolute inset-0 bg-white/30" />
                </div>
              </div>
            </div>
          )}

          {/* Generated Articles List */}
          {articles.length > 0 && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Gerados</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{articles.length}</p>
                </div>
                <div className="rounded-2xl p-5 border border-teal-500/20 bg-teal-500/5 backdrop-blur-md">
                  <p className="text-xs text-teal-600 dark:text-teal-400/80 uppercase tracking-wider mb-1">Sucesso</p>
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{successCount}</p>
                </div>
                <div className="rounded-2xl p-5 border border-red-500/20 bg-red-500/5 backdrop-blur-md">
                  <p className="text-xs text-red-600 dark:text-red-400/80 uppercase tracking-wider mb-1">Erros</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{errorCount}</p>
                </div>
                <div className="rounded-2xl p-5 border border-teal-500/20 bg-teal-500/5 backdrop-blur-md">
                  <p className="text-xs text-teal-600 dark:text-teal-400/80 uppercase tracking-wider mb-1">Selecionados</p>
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{selectedCount}</p>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {articles.map((article) => {
                  const config = getTypeConfig(article.type);

                  return (
                    <div
                      key={article.id}
                      className={`rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden ${article.selected
                        ? 'border-teal-500/30 bg-teal-500/5 shadow-[0_0_30px_rgba(20,184,166,0.05)]'
                        : 'border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5'
                        } ${article.status === 'generating' ? 'opacity-70' : 'opacity-100'}`}
                    >
                      <div className="flex items-start gap-5 relative z-10">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleArticleSelection(article.id)}
                          disabled={article.status !== 'success'}
                          className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ${article.selected
                            ? 'border-teal-500 bg-teal-500'
                            : 'border-gray-600 bg-transparent hover:border-gray-400'
                            }`}
                        >
                          {article.selected && (
                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-4 leading-tight">
                              {article.title}
                            </h3>

                            {/* Status Badge */}
                            <div className="flex-shrink-0">
                              {article.status === 'pending' && (
                                <span className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-gray-400 border border-white/5">
                                  Aguardando
                                </span>
                              )}
                              {article.status === 'generating' && (
                                <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-2">
                                  <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 animate-spin" />
                                  Gerando...
                                </span>
                              )}
                              {article.status === 'success' && (
                                <span className="text-xs px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-2">
                                  <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
                                  Pronto
                                </span>
                              )}
                              {article.status === 'error' && (
                                <span className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-2">
                                  <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3" />
                                  Erro
                                </span>
                              )}
                            </div>
                          </div>

                          {article.excerpt && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                              {article.excerpt}
                            </p>
                          )}

                          {article.status === 'success' && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {article.category && (
                                <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10">
                                  {article.category}
                                </span>
                              )}
                              {article.citations && article.citations.length > 0 && (
                                <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                  {article.citations.length} fontes
                                </span>
                              )}
                            </div>
                          )}

                          {article.error && (
                            <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                              <div className="flex items-start gap-3 mb-3">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-300 flex-1">{article.error}</p>
                              </div>

                              {/* Botão Corrigir com IA */}
                              {(article.error.includes('faltando') || article.error.includes('muito curto')) && (
                                <button
                                  onClick={() => handleFixWithAI(article)}
                                  disabled={isGenerating}
                                  className="w-full mt-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-teal-600 text-white shadow-lg shadow-teal-500/20"
                                >
                                  <FontAwesomeIcon icon={faRobot} className="w-4 h-4" />
                                  Corrigir com IA (Gemini)
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md sticky bottom-4 z-50 shadow-2xl justify-start">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={discardAll}
                    disabled={isGenerating}
                    className="px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-4 h-4 mr-2" />
                    Descartar Todos
                  </button>

                  <button
                    onClick={saveSelectedArticles}
                    disabled={isGenerating || selectedCount === 0}
                    className="px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                  >
                    <FontAwesomeIcon icon={faDatabase} className="w-4 h-4" />
                    Salvar {selectedCount} {selectedCount === 1 ? 'Artigo' : 'Artigos'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminRoute >
  );
}
