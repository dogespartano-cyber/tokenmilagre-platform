/**
 * Graphiti Knowledge Graph Service
 * Client para comunicação com o serviço Graphiti rodando via Podman
 * 
 * Features:
 * - Circuit Breaker pattern (abre após 5 falhas em 30s)
 * - Retry com exponential backoff (3 tentativas: 1s, 2s, 4s)
 * - Timeout de 5s por requisição
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

// ============= Circuit Breaker =============

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

class CircuitBreaker {
  private state: CircuitBreakerState = {
    failures: 0,
    lastFailureTime: 0,
    state: 'CLOSED'
  };

  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly failureWindowMs: number;

  constructor(
    failureThreshold = 5,
    resetTimeoutMs = 60000,  // 60s antes de tentar novamente
    failureWindowMs = 30000  // Janela de 30s para contar falhas
  ) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.failureWindowMs = failureWindowMs;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    if (this.state.state === 'CLOSED') return false;

    const now = Date.now();
    const timeSinceLastFailure = now - this.state.lastFailureTime;

    // Check if we should transition to HALF_OPEN
    if (this.state.state === 'OPEN' && timeSinceLastFailure >= this.resetTimeoutMs) {
      this.state.state = 'HALF_OPEN';
      console.log('[CircuitBreaker] Transitioning to HALF_OPEN');
      return false;
    }

    return this.state.state === 'OPEN';
  }

  private onSuccess(): void {
    if (this.state.state === 'HALF_OPEN') {
      console.log('[CircuitBreaker] Success in HALF_OPEN - closing circuit');
    }
    this.state = {
      failures: 0,
      lastFailureTime: 0,
      state: 'CLOSED'
    };
  }

  private onFailure(): void {
    const now = Date.now();

    // Reset counter if outside failure window
    if (now - this.state.lastFailureTime > this.failureWindowMs) {
      this.state.failures = 0;
    }

    this.state.failures++;
    this.state.lastFailureTime = now;

    if (this.state.failures >= this.failureThreshold) {
      this.state.state = 'OPEN';
      console.error(`[CircuitBreaker] OPEN after ${this.state.failures} failures`);
    }
  }

  getState(): string {
    return this.state.state;
  }
}

// ============= Retry Helper =============

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt); // 1s, 2s, 4s
        console.warn(`[Graphiti] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// ============= GraphitiService =============

export class GraphitiService {
  private baseUrl: string;
  private circuitBreaker: CircuitBreaker;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.circuitBreaker = new CircuitBreaker(5, 60000, 30000);
  }

  /**
   * Helper privado para fazer fetch com timeout de 5s
   */
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Wrapper que aplica circuit breaker + retry
   */
  private async resilientFetch(url: string, options: RequestInit = {}): Promise<Response> {
    return this.circuitBreaker.execute(() =>
      retryWithBackoff(() => this.fetchWithTimeout(url, options), 3, 1000)
    );
  }

  /**
   * Verifica se o serviço Graphiti está disponível
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Graphiti health check failed:', error);
      return false;
    }
  }

  /**
   * Retorna o estado atual do circuit breaker
   */
  getCircuitState(): string {
    return this.circuitBreaker.getState();
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
    const response = await this.resilientFetch(`${this.baseUrl}/add-episode`, {
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
    const response = await this.resilientFetch(`${this.baseUrl}/search`, {
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
    const response = await this.resilientFetch(`${this.baseUrl}/search-relationships`, {
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
