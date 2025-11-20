/**
 * Sistema de Detecção de Intenção para Admin Chat
 * Converte linguagem natural em ações estruturadas
 */

export interface Intent {
  action: 'CREATE' | 'LIST' | 'SEARCH' | 'EDIT' | 'DELETE' | 'VALIDATE' | 'IMPROVE' | 'PUBLISH' | 'REGENERATE' | 'TITLES' | 'TAGS' | 'RESEARCH' | 'STATS' | 'CHAT';
  subtype?: 'news' | 'educational' | 'resource';
  parameters?: {
    topic?: string;
    slug?: string;
    section?: string;
    query?: string;
    limit?: number;
    instruction?: string;
    articleNumber?: number;
  };
  confidence: number; // 0-1
  originalMessage: string;
}

/**
 * Padrões de linguagem natural para cada intenção
 */
const INTENT_PATTERNS = {
  // CRIAR artigos
  CREATE: {
    keywords: [
      'crie', 'criar', 'gere', 'gerar', 'escreva', 'escrever',
      'faça', 'fazer', 'nova notícia', 'novo artigo', 'novo conteúdo'
    ],
    patterns: [
      /cri(e|ar)\s+(uma?\s+)?(notícia|not[ií]cia|news)/i,
      /cri(e|ar)\s+(um\s+)?(artigo|conte[uú]do)\s+(educacional|educativo)/i,
      /cri(e|ar)\s+(uma?\s+)?(p[aá]gina|recurso)/i,
      /ger(e|ar)\s+(uma?\s+)?(notícia|artigo|conte[uú]do)/i,
      /escreva\s+(uma?\s+)?(notícia|artigo)/i,
      /fa[çc]a\s+(uma?\s+)?(notícia|artigo)/i,
    ]
  },

  // LISTAR artigos
  LIST: {
    keywords: [
      'liste', 'listar', 'mostre', 'mostrar', 'exiba', 'exibir',
      'veja', 'ver', 'quais são', 'últimos', 'recentes', 'publicados',
      'artigos publicados', 'todos os artigos'
    ],
    patterns: [
      /list(e|ar)\s+(os\s+)?([uú]ltimos\s+)?(\d+\s+)?(artigos|not[ií]cias|conte[uú]dos?)/i,
      /mostr(e|ar)\s+(os\s+)?([uú]ltimos\s+)?(\d+\s+)?(artigos|not[ií]cias)/i,
      /exib(a|ir)\s+(os\s+)?([uú]ltimos\s+)?(\d+\s+)?(artigos|not[ií]cias)/i,
      /quais\s+(s[ãa]o\s+)?(os\s+)?([uú]ltimos|recentes)\s+(\d+\s+)?(artigos|not[ií]cias)/i,
      /ver\s+(os\s+)?([uú]ltimos\s+)?(\d+\s+)?(artigos|not[ií]cias)/i,
      /([uú]ltimos?|recentes?)\s+(\d+\s+)?(artigos|not[ií]cias)/i,
      /(artigos?|not[ií]cias?)\s+publicad(os?|as?)/i,
      /todos\s+(os\s+)?(artigos|not[ií]cias)/i,
    ]
  },

  // BUSCAR artigos
  SEARCH: {
    keywords: [
      'busque', 'buscar', 'procure', 'procurar', 'encontre', 'encontrar',
      'pesquise', 'pesquisar', 'ache', 'achar'
    ],
    patterns: [
      /busqu(e|ar)\s+(artigos?|not[ií]cias?)\s+(sobre|de|com)/i,
      /procur(e|ar)\s+(artigos?|not[ií]cias?)\s+(sobre|de|com)/i,
      /encontr(e|ar)\s+(artigos?|not[ií]cias?)\s+(sobre|de|com)/i,
      /pesquis(e|ar)\s+(artigos?|not[ií]cias?)\s+(sobre|de|com)/i,
    ]
  },

  // DELETAR artigos
  DELETE: {
    keywords: [
      'delete', 'deletar', 'remova', 'remover', 'apague', 'apagar',
      'exclua', 'excluir'
    ],
    patterns: [
      /delet(e|ar)\s+(o\s+)?(artigo|not[ií]cia)/i,
      /remov(a|er)\s+(o\s+)?(artigo|not[ií]cia)/i,
      /apagu(e|ar)\s+(o\s+)?(artigo|not[ií]cia)/i,
      /exclu(a|ir)\s+(o\s+)?(artigo|not[ií]cia)/i,
    ]
  },

  // EDITAR artigos
  EDIT: {
    keywords: [
      'edite', 'editar', 'modifique', 'modificar', 'altere', 'alterar',
      'atualize', 'atualizar', 'corrija', 'corrigir', 'remova', 'remover',
      'retire', 'retirar', 'delete', 'deletar', 'conserte', 'consertar'
    ],
    patterns: [
      /edit(e|ar)\s+(o\s+)?(artigo|not[ií]cia)/i,
      /modifiqu(e|ar)\s+(o\s+)?(artigo|not[ií]cia)/i,
      /alter(e|ar)\s+(o\s+)?(artigo|not[ií]cia)/i,
      /actualiz(e|ar)\s+(o\s+)?(artigo|not[ií]cia)/i,
      /remov(a|er)\s+(.+?)\s+(do|no)\s+(artigo|not[ií]cia)/i,
      /retir(e|ar)\s+(.+?)\s+(do|no)\s+(artigo|not[ií]cia)/i,
      /corrij(a|ir)\s+(o\s+)?(artigo|not[ií]cia)/i,
      /consert(e|ar)\s+(o\s+)?(artigo|not[ií]cia)/i,
    ]
  },

  // VALIDAR conteúdo
  VALIDATE: {
    keywords: [
      'valide', 'validar', 'verifique', 'verificar', 'cheque', 'checar',
      'analise', 'analisar', 'revise', 'revisar'
    ],
    patterns: [
      /valid(e|ar)\s+(este|esse|o)?\s*(artigo|conte[uú]do)?/i,
      /verifiqu(e|ar)\s+(este|esse|o)?\s*(artigo|conte[uú]do)?/i,
      /chequ(e|ar)\s+(este|esse|o)?\s*(artigo|conte[uú]do)?/i,
      /analis(e|ar)\s+(este|esse|o)?\s*(artigo|conte[uú]do)?/i,
      /revis(e|ar)\s+(este|esse|o)?\s*(artigo|conte[uú]do)?/i,
    ]
  },

  // MELHORAR conteúdo
  IMPROVE: {
    keywords: [
      'melhore', 'melhorar', 'aprimore', 'aprimorar', 'otimize', 'otimizar',
      'refine', 'refinar', 'reescreva', 'reescrever'
    ],
    patterns: [
      /melhor(e|ar)\s+(a|o)?\s*(introdu[çc][ãa]o|conclus[ãa]o|se[çc][ãa]o)?/i,
      /aprimorar\s+(a|o)?\s*(introdu[çc][ãa]o|conclus[ãa]o|se[çc][ãa]o)?/i,
      /reescrev(a|er)\s+(a|o)?\s*(introdu[çc][ãa]o|conclus[ãa]o|se[çc][ãa]o)?/i,
    ]
  },

  // PUBLICAR artigo
  PUBLISH: {
    keywords: [
      'publique', 'publicar', 'poste', 'postar', 'lance', 'lançar'
    ],
    patterns: [
      /publiqu(e|ar)\s+(este|esse|o)?\s*(artigo)?/i,
      /post(e|ar)\s+(este|esse|o)?\s*(artigo)?/i,
      /lan[çc](e|ar)\s+(este|esse|o)?\s*(artigo)?/i,
    ]
  },

  // REGENERAR artigo
  REGENERATE: {
    keywords: [
      'regenere', 'regenerar', 'refaça', 'refazer', 'recrie', 'recriar'
    ],
    patterns: [
      /regener(e|ar)\s+(este|esse|o)?\s*(artigo)?/i,
      /refa[çc](a|er)\s+(este|esse|o)?\s*(artigo)?/i,
      /recri(e|ar)\s+(este|esse|o)?\s*(artigo)?/i,
    ]
  },

  // TÍTULOS alternativos
  TITLES: {
    keywords: [
      'títulos', 'título', 'alternativas', 'sugestões de título'
    ],
    patterns: [
      /ger(e|ar)\s+(t[ií]tulos?|alternativas)/i,
      /suger(e|ir)\s+(t[ií]tulos?)/i,
      /t[ií]tulos?\s+alternativos?/i,
    ]
  },

  // TAGS
  TAGS: {
    keywords: [
      'tags', 'tag', 'etiquetas', 'categorias'
    ],
    patterns: [
      /ger(e|ar)\s+tags?/i,
      /suger(e|ir)\s+tags?/i,
      /quais\s+tags?/i,
    ]
  },

  // PESQUISAR informações
  RESEARCH: {
    keywords: [
      'pesquise', 'pesquisar', 'busque informações', 'o que há de novo'
    ],
    patterns: [
      /pesquis(e|ar)\s+(sobre|informa[çc][õo]es)/i,
      /o\s+que\s+h[aá]\s+de\s+novo\s+(sobre|em)/i,
      /busque?\s+informa[çc][õo]es\s+(sobre|de)/i,
    ]
  },

  // ESTATÍSTICAS
  STATS: {
    keywords: [
      'estatísticas', 'stats', 'números', 'quantos', 'total'
    ],
    patterns: [
      /estat[ií]sticas?/i,
      /quantos\s+(artigos?|not[ií]cias?)/i,
      /total\s+de\s+(artigos?|not[ií]cias?)/i,
      /n[uú]meros?\s+(do\s+)?(blog|site|plataforma)/i,
    ]
  },
};

/**
 * Detecta subtipo de artigo (news, educational, resource)
 */
function detectArticleSubtype(message: string): 'news' | 'educational' | 'resource' | undefined {
  const lower = message.toLowerCase();

  // News
  if (lower.match(/not[ií]cia|news|novidade/)) {
    return 'news';
  }

  // Educational
  if (lower.match(/educacional|educativo|tutorial|guia|como funciona/)) {
    return 'educational';
  }

  // Resource
  if (lower.match(/recurso|p[aá]gina|ferramenta|wallet|exchange/)) {
    return 'resource';
  }

  return undefined;
}

/**
 * Extrai tópico da mensagem para criação de artigo
 */
function extractTopic(message: string): string | undefined {
  // Remove palavras de comando
  const topic = message
    .replace(/^(cri(e|ar)|ger(e|ar)|escreva?|fa[çc]a)\s+/i, '')
    .replace(/^(uma?\s+)?(notícia|artigo|conte[uú]do|p[aá]gina|recurso)\s+(sobre|de|em)?\s*/i, '')
    .trim();

  return topic.length > 3 ? topic : undefined;
}

/**
 * Extrai limite numérico (ex: "últimos 10 artigos")
 */
function extractLimit(message: string): number | undefined {
  const match = message.match(/(\d+)\s+(artigos?|not[ií]cias?)/i);
  if (match) {
    const num = parseInt(match[1], 10);
    return num > 0 && num <= 50 ? num : 10; // max 50
  }
  return undefined;
}

/**
 * Extrai query de busca
 */
function extractSearchQuery(message: string): string | undefined {
  const match = message.match(/(?:sobre|de|com)\s+(.+)/i);
  return match ? match[1].trim() : undefined;
}

/**
 * Extrai seção para melhoria
 */
function extractSection(message: string): string | undefined {
  const match = message.match(/(introdu[çc][ãa]o|conclus[ãa]o|se[çc][ãa]o\s*\d*)/i);
  return match ? match[1] : undefined;
}

/**
 * Extrai instrução de edição (o que fazer)
 */
function extractEditInstruction(message: string): string | undefined {
  // Remover palavras de comando no início
  const instruction = message
    .replace(/^(edit(e|ar)|modifiqu(e|ar)|alter(e|ar)|actualiz(e|ar)|corrij(a|ir)|consert(e|ar)|remov(a|er)|retir(e|ar))\s+/i, '')
    .replace(/^(o\s+|a\s+)?(artigo|not[ií]cia)\s+/i, '')
    .trim();

  return instruction.length > 3 ? instruction : undefined;
}

/**
 * Extrai título do artigo mencionado (entre aspas ou após "artigo")
 */
function extractArticleTitle(message: string): string | undefined {
  // Tentar extrair título entre aspas
  const quotedMatch = message.match(/["""]([^"""]+)["""]/);
  if (quotedMatch) {
    return quotedMatch[1].trim();
  }

  // Tentar extrair após padrões como "do artigo X" ou "no artigo X"
  const titleMatch = message.match(/(?:do|no|o)\s+artigo\s+\d+\s*["""]?\s*(.+?)\s*[""""]?\s*(?:remova|corrija|edite|atualize|por exemplo|$)/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  return undefined;
}

/**
 * Extrai número do artigo mencionado (ex: "artigo 4")
 */
function extractArticleNumber(message: string): number | undefined {
  const match = message.match(/artigo\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Detecta intenção do usuário baseado em linguagem natural
 */
export function detectIntent(message: string): Intent {
  const lower = message.toLowerCase().trim();

  // Se começa com /, é comando direto (retorna CHAT para processar no route.ts)
  if (message.startsWith('/')) {
    return {
      action: 'CHAT',
      confidence: 1.0,
      originalMessage: message
    };
  }

  let bestMatch: Intent = {
    action: 'CHAT',
    confidence: 0,
    originalMessage: message
  };

  // Verificar cada tipo de intenção
  for (const [action, config] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;

    // Verificar padrões regex (peso 0.6)
    for (const pattern of config.patterns) {
      if (pattern.test(message)) {
        score += 0.6;
        break;
      }
    }

    // Verificar keywords (peso 0.4)
    for (const keyword of config.keywords) {
      if (lower.includes(keyword)) {
        score += 0.4 / config.keywords.length;
      }
    }

    // Se score é maior que o melhor match atual
    if (score > bestMatch.confidence) {
      const intent: Intent = {
        action: action as Intent['action'],
        confidence: score,
        originalMessage: message
      };

      // Extrair parâmetros específicos por ação
      switch (action) {
        case 'CREATE':
          intent.subtype = detectArticleSubtype(message);
          intent.parameters = { topic: extractTopic(message) };
          break;

        case 'SEARCH':
          intent.parameters = { query: extractSearchQuery(message), limit: 10 };
          break;

        case 'LIST':
          intent.parameters = { limit: extractLimit(message) || 10 };
          break;

        case 'DELETE':
          intent.parameters = { query: extractSearchQuery(message) || extractTopic(message) };
          break;

        case 'EDIT':
          const articleNumber = extractArticleNumber(message);
          intent.parameters = {
            query: extractArticleTitle(message) || extractSearchQuery(message) || extractTopic(message),
            instruction: extractEditInstruction(message),
            articleNumber
          };
          break;

        case 'IMPROVE':
          intent.parameters = { section: extractSection(message) };
          break;

        case 'RESEARCH':
          intent.parameters = { query: extractSearchQuery(message) || extractTopic(message) };
          break;
      }

      bestMatch = intent;
    }
  }

  // Se confiança é muito baixa, retornar CHAT
  if (bestMatch.confidence < 0.3) {
    return {
      action: 'CHAT',
      confidence: 1.0,
      originalMessage: message
    };
  }

  return bestMatch;
}

/**
 * Formata intenção detectada para debug
 */
export function formatIntent(intent: Intent): string {
  return `Action: ${intent.action}
Confidence: ${(intent.confidence * 100).toFixed(0)}%
Subtype: ${intent.subtype || 'N/A'}
Parameters: ${JSON.stringify(intent.parameters || {})}`;
}
