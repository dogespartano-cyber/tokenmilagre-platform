/**
 * Exemplos de uso do Graphiti Service no TokenMilagre Platform
 */

import { graphitiService } from './graphiti.service';

/**
 * Exemplo 1: Rastrear progresso do usuário em artigos
 */
export async function trackArticleRead(userId: string, articleTitle: string, articleId: string) {
  try {
    await graphitiService.addEpisode({
      user_id: userId,
      text: `Usuário leu e completou o artigo "${articleTitle}" sobre blockchain e criptomoedas`,
      metadata: {
        article_id: articleId,
        completed_at: new Date().toISOString(),
        type: 'article_read',
      },
    });
    console.log('✅ Progresso registrado no grafo de conhecimento');
  } catch (error) {
    console.error('❌ Erro ao registrar progresso:', error);
  }
}

/**
 * Exemplo 2: Recomendar próximos artigos com base no histórico
 */
export async function getRecommendedArticles(userId: string, currentTopic: string) {
  try {
    const result = await graphitiService.search({
      query: `artigos relacionados a ${currentTopic} que o usuário ${userId} ainda não leu`,
      limit: 5,
    });

    console.log('📚 Artigos recomendados:', result.results);
    return result.results;
  } catch (error) {
    console.error('❌ Erro ao buscar recomendações:', error);
    return [];
  }
}

/**
 * Exemplo 3: Registrar interesse do usuário em tópicos
 */
export async function trackUserInterest(userId: string, topic: string, interactionType: 'view' | 'like' | 'share') {
  try {
    await graphitiService.addEpisode({
      user_id: userId,
      text: `Usuário demonstrou interesse em ${topic} através de ${interactionType}`,
      metadata: {
        topic,
        interaction_type: interactionType,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Erro ao registrar interesse:', error);
  }
}

/**
 * Exemplo 4: Buscar informações sobre o token $MILAGRE
 */
export async function searchMilagreInfo(userQuestion: string) {
  try {
    const result = await graphitiService.search({
      query: userQuestion,
      limit: 3,
    });

    return {
      answer: result.results,
      sources: result.count,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar informações:', error);
    return null;
  }
}

/**
 * Exemplo 5: Analisar relacionamentos entre tópicos
 */
export async function findRelatedTopics(topic: string) {
  try {
    const result = await graphitiService.searchRelationships({
      query: `tópicos e conceitos relacionados a ${topic}`,
      limit: 10,
    });

    console.log(`🔗 Tópicos relacionados a "${topic}":`, result.results);
    return result.results;
  } catch (error) {
    console.error('❌ Erro ao buscar relacionamentos:', error);
    return [];
  }
}

/**
 * Exemplo 6: Registrar feedback do usuário
 */
export async function trackUserFeedback(userId: string, contentId: string, rating: number, comment: string) {
  try {
    await graphitiService.addEpisode({
      user_id: userId,
      text: `Usuário avaliou o conteúdo ${contentId} com nota ${rating}/5 e comentou: "${comment}"`,
      metadata: {
        content_id: contentId,
        rating,
        comment,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Erro ao registrar feedback:', error);
  }
}

/**
 * Exemplo 7: Verificar se o serviço está disponível antes de usar
 */
export async function safeGraphitiOperation<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const isHealthy = await graphitiService.healthCheck();
    if (!isHealthy) {
      console.warn('⚠️ Serviço Graphiti indisponível, usando fallback');
      return fallback;
    }
    return await operation();
  } catch (error) {
    console.error('❌ Erro em operação Graphiti:', error);
    return fallback;
  }
}

/**
 * Exemplo de uso em um componente Server Component:
 *
 * ```tsx
 * // app/educacao/[slug]/page.tsx
 * import { trackArticleRead, getRecommendedArticles } from '@/lib/services/graphiti.example';
 * import { auth } from '@clerk/nextjs';
 *
 * export default async function ArticlePage({ params }: { params: { slug: string } }) {
 *   const { userId } = await auth();
 *
 *   if (userId) {
 *     // Registrar leitura (não bloqueante)
 *     trackArticleRead(userId, article.title, article.id).catch(console.error);
 *
 *     // Buscar recomendações
 *     const recommended = await getRecommendedArticles(userId, article.category);
 *   }
 *
 *   return (
 *     <div>
 *       {/* ... conteúdo do artigo ... *\/}
 *       {recommended && (
 *         <div>
 *           <h2>Leia também:</h2>
 *           {recommended.map(rec => (
 *             <ArticleCard key={rec.id} {...rec} />
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * Exemplo de uso em API Route:
 *
 * ```tsx
 * // app/api/knowledge/search/route.ts
 * import { NextRequest, NextResponse } from 'next/server';
 * import { graphitiService } from '@/lib/services/graphiti.service';
 *
 * export async function POST(request: NextRequest) {
 *   const { query } = await request.json();
 *
 *   const results = await graphitiService.search({
 *     query,
 *     limit: 10,
 *   });
 *
 *   return NextResponse.json(results);
 * }
 * ```
 */
