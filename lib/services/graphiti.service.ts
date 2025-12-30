/**
 * Graphiti Knowledge Graph Service
 * Client para comunicação com o serviço Graphiti rodando via Podman
 */

export interface EpisodeRequest {
  user_id: string;
  text: string;
  metadata?: Record<string, any>;
}

export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface GraphitiResponse<T = any> {
  status: string;
  message?: string;
  results?: T;
  count?: number;
  query?: string;
}

export class GraphitiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Verifica se o serviço Graphiti está disponível
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Graphiti health check failed:', error);
      return false;
    }
  }

  /**
   * Adiciona um episódio (evento/interação) ao grafo de conhecimento
   *
   * Exemplo:
   * ```ts
   * await graphiti.addEpisode({
   *   user_id: 'user123',
   *   text: 'João completou o curso de DeFi Basics',
   *   metadata: { course_id: 'defi-101', completed_at: new Date().toISOString() }
   * });
   * ```
   */
  async addEpisode(request: EpisodeRequest): Promise<GraphitiResponse> {
    const response = await fetch(`${this.baseUrl}/add-episode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to add episode: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Busca semântica no grafo de conhecimento
   *
   * Exemplo:
   * ```ts
   * const results = await graphiti.search({
   *   query: 'cursos sobre DeFi que João ainda não completou',
   *   limit: 5
   * });
   * ```
   */
  async search(request: SearchRequest): Promise<GraphitiResponse> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Busca por relacionamentos no grafo de conhecimento
   *
   * Exemplo:
   * ```ts
   * const results = await graphiti.searchRelationships({
   *   query: 'artigos relacionados a Solana',
   *   limit: 10
   * });
   * ```
   */
  async searchRelationships(request: SearchRequest): Promise<GraphitiResponse> {
    const response = await fetch(`${this.baseUrl}/search-relationships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Relationship search failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const graphitiService = new GraphitiService();
