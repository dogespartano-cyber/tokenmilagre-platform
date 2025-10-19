export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: 'google' | 'brave';
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  source: 'google' | 'brave' | 'combined';
}

/**
 * Busca no Google Custom Search API
 */
async function searchGoogle(query: string): Promise<SearchResponse> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.warn('Google Search API não configurada. Pulando...');
    return { results: [], totalResults: 0, source: 'google' };
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      console.error(`Google Search API error: ${response.status}`);
      return { results: [], totalResults: 0, source: 'google' };
    }

    const data = await response.json();

    const results: SearchResult[] = (data.items || []).map((item: any) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      source: 'google' as const
    }));

    return {
      results,
      totalResults: parseInt(data.searchInformation?.totalResults || '0'),
      source: 'google'
    };
  } catch (error) {
    console.error('Erro ao buscar no Google:', error);
    return { results: [], totalResults: 0, source: 'google' };
  }
}

/**
 * Busca no Brave Search API
 */
async function searchBrave(query: string): Promise<SearchResponse> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;

  if (!apiKey) {
    console.warn('Brave Search API não configurada. Pulando...');
    return { results: [], totalResults: 0, source: 'brave' };
  }

  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': apiKey
      }
    });

    if (!response.ok) {
      console.error(`Brave Search API error: ${response.status}`);
      return { results: [], totalResults: 0, source: 'brave' };
    }

    const data = await response.json();

    const results: SearchResult[] = (data.web?.results || []).map((item: any) => ({
      title: item.title,
      url: item.url,
      snippet: item.description,
      source: 'brave' as const
    }));

    return {
      results,
      totalResults: data.web?.results?.length || 0,
      source: 'brave'
    };
  } catch (error) {
    console.error('Erro ao buscar no Brave:', error);
    return { results: [], totalResults: 0, source: 'brave' };
  }
}

/**
 * Busca em múltiplas fontes (Google + Brave) e combina resultados
 */
export async function searchMultipleSources(query: string): Promise<SearchResponse> {
  try {
    // Executar buscas em paralelo
    const [googleResults, braveResults] = await Promise.all([
      searchGoogle(query),
      searchBrave(query)
    ]);

    // Combinar resultados
    const combinedResults = [
      ...googleResults.results,
      ...braveResults.results
    ];

    // Remover duplicatas baseadas em URL
    const uniqueResults = combinedResults.filter((result, index, self) =>
      index === self.findIndex(r => r.url === result.url)
    );

    return {
      results: uniqueResults,
      totalResults: uniqueResults.length,
      source: 'combined'
    };
  } catch (error) {
    console.error('Erro ao buscar em múltiplas fontes:', error);
    return { results: [], totalResults: 0, source: 'combined' };
  }
}

/**
 * Verifica se pelo menos uma API de busca está configurada
 */
export function hasSearchAPIsConfigured(): boolean {
  const hasGoogle = !!(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID);
  const hasBrave = !!process.env.BRAVE_SEARCH_API_KEY;

  return hasGoogle || hasBrave;
}

/**
 * Retorna informações sobre quais APIs estão configuradas
 */
export function getConfiguredAPIs(): string[] {
  const apis: string[] = [];

  if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID) {
    apis.push('Google Custom Search');
  }

  if (process.env.BRAVE_SEARCH_API_KEY) {
    apis.push('Brave Search');
  }

  return apis;
}
