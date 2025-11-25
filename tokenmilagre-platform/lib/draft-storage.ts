/**
 * Sistema de cache/rascunhos para artigos gerados
 * Salva no localStorage para persistência entre recarregamentos
 * 
 * @module DraftStorage
 * @description Evita perda de artigos gerados pela IA em caso de erro de salvamento,
 * economizando custos da API Perplexity (~$0.008 por artigo)
 */

export interface DraftArticle {
  id: string;
  type: 'news' | 'educational' | 'resource';
  timestamp: number;
  data: any; // Artigo processado completo
  error?: string; // Erro que causou falha no salvamento
}

const STORAGE_KEY = 'tokenmilagre_article_drafts';
const MAX_DRAFTS = 50; // Limite para não sobrecarregar localStorage (5MB aprox)
const DRAFT_EXPIRY_DAYS = 7; // Limpar rascunhos após 7 dias

/**
 * Serviço para gerenciar rascunhos de artigos no localStorage
 * 
 * @example
 * ```typescript
 * // Salvar artigo após geração
 * DraftStorageService.saveDraft(processedArticle, 'news');
 * 
 * // Recuperar ao carregar página
 * const drafts = DraftStorageService.getDraftsByType('news');
 * 
 * // Limpar após salvamento bem-sucedido
 * DraftStorageService.clearSuccessful(['article-slug-1', 'article-slug-2']);
 * ```
 */
export class DraftStorageService {
  /**
   * Salva um artigo como rascunho no localStorage
   * @param article - Artigo processado (após processArticleLocally)
   * @param type - Tipo do artigo (news/educational/resource)
   * @param error - Mensagem de erro opcional (se falhou ao salvar)
   */
  static saveDraft(article: any, type: string, error?: string): void {
    try {
      const draft: DraftArticle = {
        id: `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: type as DraftArticle['type'],
        timestamp: Date.now(),
        data: article,
        error
      };

      const drafts = this.getAllDrafts();
      drafts.unshift(draft); // Adicionar no início (mais recentes primeiro)

      // Limitar número de rascunhos
      const trimmed = drafts.slice(0, MAX_DRAFTS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      console.log('💾 Rascunho salvo:', draft.id, error ? `(com erro: ${error})` : '');
    } catch (error) {
      console.error('❌ Erro ao salvar rascunho:', error);
      // Não lançar exceção - salvamento de rascunho é nice-to-have
    }
  }

  /**
   * Recupera todos os rascunhos válidos (não expirados)
   * @returns Array de rascunhos ordenados por timestamp (mais recente primeiro)
   */
  static getAllDrafts(): DraftArticle[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const drafts: DraftArticle[] = JSON.parse(stored);

      // Filtrar rascunhos expirados
      const expiryTime = Date.now() - (DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      const validDrafts = drafts.filter(d => d.timestamp > expiryTime);

      // Se removeu algum expirado, atualizar storage
      if (validDrafts.length !== drafts.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validDrafts));
        console.log(`🗑️ ${drafts.length - validDrafts.length} rascunho(s) expirado(s) removido(s)`);
      }

      return validDrafts;
    } catch (error) {
      console.error('❌ Erro ao recuperar rascunhos:', error);
      return [];
    }
  }

  /**
   * Recupera rascunhos filtrados por tipo
   * @param type - Tipo do artigo (news/educational/resource)
   * @returns Array de rascunhos do tipo especificado
   */
  static getDraftsByType(type: string): DraftArticle[] {
    return this.getAllDrafts().filter(d => d.type === type);
  }

  /**
   * Remove um rascunho específico
   * @param id - ID do rascunho a ser removido
   */
  static removeDraft(id: string): void {
    try {
      const drafts = this.getAllDrafts().filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      console.log('🗑️ Rascunho removido:', id);
    } catch (error) {
      console.error('❌ Erro ao remover rascunho:', error);
    }
  }

  /**
   * Limpa todos os rascunhos
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Todos os rascunhos limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar rascunhos:', error);
    }
  }

  /**
   * Remove rascunhos que foram salvos com sucesso no banco
   * @param articleSlugs - Array de slugs dos artigos salvos com sucesso
   */
  static clearSuccessful(articleSlugs: string[]): void {
    try {
      const drafts = this.getAllDrafts().filter(d => {
        const slug = d.data.slug || d.data.id;
        return !articleSlugs.includes(slug);
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      console.log(`✅ ${this.getAllDrafts().length - drafts.length} rascunho(s) bem-sucedido(s) removido(s)`);
    } catch (error) {
      console.error('❌ Erro ao limpar rascunhos bem-sucedidos:', error);
    }
  }

  /**
   * Obtém estatísticas dos rascunhos
   * @returns Objeto com contagens por tipo e total
   */
  static getStats() {
    const drafts = this.getAllDrafts();
    return {
      total: drafts.length,
      byType: {
        news: drafts.filter(d => d.type === 'news').length,
        educational: drafts.filter(d => d.type === 'educational').length,
        resource: drafts.filter(d => d.type === 'resource').length,
      },
      withErrors: drafts.filter(d => d.error).length,
      oldestTimestamp: drafts.length > 0 ? Math.min(...drafts.map(d => d.timestamp)) : null,
    };
  }
}
