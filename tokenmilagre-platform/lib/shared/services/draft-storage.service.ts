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
  errorDetails?: PublishErrorLog; // Detalhes estruturados do erro
}

/**
 * Log estruturado de erros de publicação
 */
export interface PublishErrorLog {
  timestamp: number;
  errorType: 'validation' | 'api' | 'network' | 'unknown';
  message: string;
  details?: {
    field?: string;
    expected?: string;
    received?: string;
    validationErrors?: string[];
    httpStatus?: number;
    apiResponse?: any;
  };
}

const STORAGE_KEY = 'tokenmilagre_article_drafts';
const ERROR_LOG_KEY = 'tokenmilagre_publish_errors';
const MAX_DRAFTS = 50; // Limite para não sobrecarregar localStorage (5MB aprox)
const MAX_ERROR_LOGS = 100;
const DRAFT_EXPIRY_DAYS = 7; // Limpar rascunhos após 7 dias

/**
 * Serviço para gerenciar rascunhos de artigos no localStorage
 */
export class DraftStorageService {
  /**
   * Salva um artigo como rascunho no localStorage
   */
  static saveDraft(article: any, type: string, error?: string, errorDetails?: PublishErrorLog): void {
    try {
      const draft: DraftArticle = {
        id: `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: type as DraftArticle['type'],
        timestamp: Date.now(),
        data: article,
        error,
        errorDetails
      };

      const drafts = this.getAllDrafts();
      drafts.unshift(draft);
      const trimmed = drafts.slice(0, MAX_DRAFTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      console.log('💾 Rascunho salvo:', draft.id, error ? `(com erro: ${error})` : '');
    } catch (error) {
      console.error('❌ Erro ao salvar rascunho:', error);
    }
  }

  /**
   * Atualiza um rascunho existente
   */
  static updateDraft(id: string, updates: Partial<DraftArticle['data']>): void {
    try {
      const drafts = this.getAllDrafts();
      const index = drafts.findIndex(d => d.id === id);
      if (index === -1) {
        console.warn('⚠️ Rascunho não encontrado:', id);
        return;
      }
      drafts[index] = {
        ...drafts[index],
        data: { ...drafts[index].data, ...updates },
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      console.log('✏️ Rascunho atualizado:', id);
    } catch (error) {
      console.error('❌ Erro ao atualizar rascunho:', error);
    }
  }

  /**
   * Atualiza o erro de um rascunho
   */
  static updateDraftError(id: string, error: string, errorDetails?: PublishErrorLog): void {
    try {
      const drafts = this.getAllDrafts();
      const index = drafts.findIndex(d => d.id === id);
      if (index === -1) return;
      drafts[index].error = error;
      drafts[index].errorDetails = errorDetails;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    } catch (error) {
      console.error('❌ Erro ao atualizar erro do rascunho:', error);
    }
  }

  /**
   * Limpa o erro de um rascunho (após correção bem-sucedida)
   */
  static clearDraftError(id: string): void {
    try {
      const drafts = this.getAllDrafts();
      const index = drafts.findIndex(d => d.id === id);
      if (index === -1) return;
      delete drafts[index].error;
      delete drafts[index].errorDetails;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    } catch (error) {
      console.error('❌ Erro ao limpar erro do rascunho:', error);
    }
  }

  /**
   * Recupera todos os rascunhos válidos (não expirados)
   */
  static getAllDrafts(): DraftArticle[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const drafts: DraftArticle[] = JSON.parse(stored);
      const expiryTime = Date.now() - (DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      const validDrafts = drafts.filter(d => d.timestamp > expiryTime);

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
   */
  static getDraftsByType(type: string): DraftArticle[] {
    return this.getAllDrafts().filter(d => d.type === type);
  }

  /**
   * Recupera rascunhos com erros
   */
  static getDraftsWithErrors(): DraftArticle[] {
    return this.getAllDrafts().filter(d => d.error);
  }

  /**
   * Recupera um rascunho específico por ID
   */
  static getDraftById(id: string): DraftArticle | undefined {
    return this.getAllDrafts().find(d => d.id === id);
  }

  /**
   * Remove um rascunho específico
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

  // ================== ERROR LOGGING ==================

  /**
   * Registra um erro de publicação detalhado
   */
  static logPublishError(articleTitle: string, errorLog: PublishErrorLog): void {
    try {
      const logs = this.getErrorLogs();
      logs.unshift({ articleTitle, ...errorLog });
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(logs.slice(0, MAX_ERROR_LOGS)));

      // Log detalhado no console
      console.group(`❌ Erro de Publicação: ${articleTitle}`);
      console.log('Tipo:', errorLog.errorType);
      console.log('Mensagem:', errorLog.message);
      if (errorLog.details) {
        console.log('Detalhes:', errorLog.details);
      }
      console.groupEnd();
    } catch (error) {
      console.error('❌ Erro ao registrar log:', error);
    }
  }

  /**
   * Recupera logs de erro
   */
  static getErrorLogs(): Array<{ articleTitle: string } & PublishErrorLog> {
    try {
      const stored = localStorage.getItem(ERROR_LOG_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Limpa logs de erro
   */
  static clearErrorLogs(): void {
    localStorage.removeItem(ERROR_LOG_KEY);
  }

  /**
   * Cria um log de erro estruturado a partir de uma resposta de API
   */
  static createErrorLog(
    type: PublishErrorLog['errorType'],
    message: string,
    details?: PublishErrorLog['details']
  ): PublishErrorLog {
    return {
      timestamp: Date.now(),
      errorType: type,
      message,
      details
    };
  }
}

