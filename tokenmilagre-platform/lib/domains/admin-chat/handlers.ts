/**
 * 🌀 Admin Chat Domain - Action Handlers
 * 
 * @agi-domain: admin-chat
 * @agi-pattern: fractal auto-similar
 * 
 * Handlers para ações específicas do Admin Chat.
 */

import type { ApiArticle, ChatMessage, CanvasArticle } from './types';
import { createAssistantMessage, getErrorMessage } from './utils';
import { fetchArticles, fetchArticleBySlug, generateArticle, deleteArticle } from './api';

type AddMessage = (message: ChatMessage) => void;

/**
 * Handle: Gerar artigo
 */
export async function handleGenerateArticle(
    data: { type: string; topic: string },
    addMessage: AddMessage
): Promise<void> {
    addMessage(createAssistantMessage(
        `🤖 **Gerando artigo...**\n\nTipo: ${data.type}\nTópico: ${data.topic}\n\nAguarde, isso pode levar alguns segundos...`
    ));

    try {
        const result = await generateArticle(data);

        if (result.success && result.data) {
            addMessage(createAssistantMessage(
                `✅ **Artigo gerado com sucesso!**\n\n` +
                `**Título**: ${result.data.title}\n` +
                `**Categoria**: ${result.data.category}\n` +
                `**Tags**: ${result.data.tags.join(', ')}\n\n` +
                `${result.validation ? `**Score de Validação**: ${result.validation.score}/100\n\n` : ''}` +
                `O artigo aparecerá na tela principal.`
            ));

            window.dispatchEvent(new CustomEvent('article-generated', {
                detail: result.data
            }));
        } else {
            let errorContent = `❌ **Erro ao gerar artigo**: ${result.error}`;
            if (result.debug) {
                errorContent += `\n\n**Debug**:\n\`\`\`\n${result.debug}\n\`\`\``;
            }
            addMessage(createAssistantMessage(errorContent));
        }
    } catch (error) {
        addMessage(createAssistantMessage(
            `❌ **Erro ao gerar artigo**: ${getErrorMessage(error)}`
        ));
    }
}

/**
 * Handle: Listar artigos
 */
export async function handleListArticles(
    data: { limit?: number },
    addMessage: AddMessage,
    setLastListed: (articles: ApiArticle[]) => void
): Promise<void> {
    try {
        const result = await fetchArticles({ limit: data.limit || 10 });

        if (result.success && result.data) {
            const articles = result.data as ApiArticle[];
            setLastListed(articles);

            const newsCount = articles.filter(a => a.sentiment).length;
            const educationalCount = articles.filter(a => a.level).length;

            let content = `📄 **Artigos Publicados** (${articles.length} de ${result.pagination?.total || 0})\n\n`;

            articles.forEach((article, index) => {
                const date = new Date(article.publishedAt).toLocaleDateString('pt-BR');
                const type = article.sentiment ? '📰' : '📚';
                content += `${index + 1}. ${type} **${article.title}**\n`;
                content += `   • Slug: \`${article.slug}\`\n`;
                content += `   • Categoria: ${article.category || 'Sem categoria'}\n`;
                content += `   • Publicado: ${date}\n\n`;
            });

            content += `\n**Estatísticas**:\n`;
            content += `• Total: ${result.pagination?.total || 0}\n`;
            content += `• Notícias: ${newsCount}\n`;
            content += `• Educacionais: ${educationalCount}\n`;

            addMessage(createAssistantMessage(content));
        } else {
            throw new Error(result.error || 'Erro ao listar artigos');
        }
    } catch (error) {
        addMessage(createAssistantMessage(
            `❌ **Erro ao listar artigos**: ${getErrorMessage(error)}`
        ));
    }
}

/**
 * Handle: Buscar artigos
 */
export async function handleSearchArticles(
    data: { query: string; limit?: number },
    addMessage: AddMessage
): Promise<void> {
    try {
        const result = await fetchArticles({ query: data.query, limit: data.limit || 10 });

        if (result.success && result.data) {
            const articles = result.data as ApiArticle[];
            let content = `🔍 **Resultados da busca**: "${data.query}"\n\n`;

            if (articles.length === 0) {
                content += `Nenhum artigo encontrado com o termo "${data.query}".\n\n`;
                content += `Tente buscar por outros termos ou crie um novo artigo.`;
            } else {
                content += `Encontrei **${articles.length}** artigo(s):\n\n`;

                articles.forEach((article, index) => {
                    const date = new Date(article.publishedAt).toLocaleDateString('pt-BR');
                    const type = article.sentiment ? '📰' : '📚';
                    content += `${index + 1}. ${type} **${article.title}**\n`;
                    content += `   • Slug: \`${article.slug}\`\n`;
                    content += `   • Publicado: ${date}\n\n`;
                });
            }

            addMessage(createAssistantMessage(content));
        } else {
            throw new Error(result.error || 'Erro ao buscar artigos');
        }
    } catch (error) {
        addMessage(createAssistantMessage(
            `❌ **Erro ao buscar artigos**: ${getErrorMessage(error)}`
        ));
    }
}

/**
 * Handle: Mostrar estatísticas
 */
export async function handleShowStats(addMessage: AddMessage): Promise<void> {
    try {
        const result = await fetchArticles({ limit: 1000 });

        if (result.success && result.data && result.pagination) {
            const articles = result.data as ApiArticle[];
            const total = result.pagination.total;

            const newsCount = articles.filter(a => a.sentiment).length;
            const educationalCount = articles.filter(a => a.level).length;

            const content = `📊 **Estatísticas do Blog**\n\n` +
                `• **Total de artigos**: ${total}\n` +
                `• **Notícias**: ${newsCount} (${total > 0 ? Math.round(newsCount / total * 100) : 0}%)\n` +
                `• **Educacionais**: ${educationalCount} (${total > 0 ? Math.round(educationalCount / total * 100) : 0}%)\n\n` +
                `Use "Liste os artigos" para ver os artigos publicados.`;

            addMessage(createAssistantMessage(content));
        } else {
            throw new Error(result.error || 'Erro ao buscar estatísticas');
        }
    } catch (error) {
        addMessage(createAssistantMessage(
            `❌ **Erro ao buscar estatísticas**: ${getErrorMessage(error)}`
        ));
    }
}

/**
 * Handle: Publicar artigo
 */
export function handlePublishArticle(
    data: Record<string, unknown>,
    addMessage: AddMessage,
    messagesRef: React.MutableRefObject<ChatMessage[]>,
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
): void {
    addMessage(createAssistantMessage(
        `📤 **Publicando artigo...**\n\nPor favor, aguarde.`
    ));

    window.dispatchEvent(new CustomEvent('publish-article', {
        detail: data
    }));

    const handlePublished = (event: Event) => {
        const customEvent = event as CustomEvent;

        if (customEvent.detail.success) {
            setMessages(prev => [...prev, createAssistantMessage(
                `✅ **Artigo publicado com sucesso!**\n\nRedirecionando para o artigo...`
            )]);
        } else {
            setMessages(prev => [...prev, createAssistantMessage(
                `❌ **Erro ao publicar**: ${customEvent.detail.error}`
            )]);
        }

        window.removeEventListener('article-published', handlePublished);
    };

    window.addEventListener('article-published', handlePublished);
}

/**
 * Handle: Editar artigo (abre canvas)
 */
export async function handleEditArticle(
    data: { query: string; instruction?: string; articleNumber?: number },
    addMessage: AddMessage,
    lastListedArticles: ApiArticle[]
): Promise<void> {
    try {
        const { query, instruction, articleNumber } = data;
        let articles: ApiArticle[] = [];

        // Se mencionou número e temos lista, usar da lista
        if (articleNumber && lastListedArticles.length > 0) {
            const index = articleNumber - 1;
            if (index >= 0 && index < lastListedArticles.length) {
                articles = [lastListedArticles[index]];
            } else {
                throw new Error(`Artigo ${articleNumber} não encontrado na lista.`);
            }
        } else {
            const result = await fetchArticles({ query, limit: 5 });
            if (!result.success || !result.data || (result.data as ApiArticle[]).length === 0) {
                throw new Error('Nenhum artigo encontrado');
            }
            articles = result.data as ApiArticle[];
        }

        // Se múltiplos artigos, perguntar qual
        if (articles.length > 1) {
            let content = `📝 **Artigos encontrados** com "${query}":\n\n`;

            articles.forEach((article, index) => {
                const date = new Date(article.publishedAt).toLocaleDateString('pt-BR');
                content += `${index + 1}. **${article.title}**\n`;
                content += `   • Slug: \`${article.slug}\`\n`;
                content += `   • Publicado: ${date}\n\n`;
            });

            content += `\n⚠️ **Qual artigo você quer editar?** Responda com o número ou slug.`;
            addMessage(createAssistantMessage(content));

            // Salvar para próxima mensagem
            window.__pendingEdit = { instruction, articles };
        } else {
            // Apenas um artigo, abrir canvas
            const article = articles[0];
            const fullResult = await fetchArticleBySlug(article.slug);

            if (!fullResult.success) {
                throw new Error('Erro ao buscar artigo completo');
            }

            const fullArticle = fullResult.data as ApiArticle & { keywords?: string[] };

            // Disparar evento para abrir canvas
            window.dispatchEvent(new CustomEvent('open-article-canvas', {
                detail: {
                    article: {
                        slug: fullArticle.slug,
                        title: fullArticle.title,
                        content: fullArticle.content,
                        summary: fullArticle.summary,
                        category: fullArticle.category,
                        tags: fullArticle.keywords
                    },
                    instruction
                }
            }));

            addMessage(createAssistantMessage(
                `📝 **Canvas aberto!**\n\n**Artigo**: ${fullArticle.title}\n\n` +
                `Você pode editar o artigo no canvas à direita.` +
                (instruction ? `\n\n**Sugestão**: ${instruction}` : '') +
                `\n\nQuando terminar, clique em **Salvar** no canvas.`,
                {
                    canvasArticle: {
                        slug: fullArticle.slug,
                        title: fullArticle.title,
                        content: fullArticle.content || '',
                        summary: fullArticle.summary,
                        category: fullArticle.category,
                        tags: fullArticle.keywords
                    },
                    instruction
                }
            ));
        }
    } catch (error) {
        addMessage(createAssistantMessage(
            `❌ **Erro ao abrir artigo**: ${getErrorMessage(error)}`
        ));
    }
}

/**
 * Handle: Confirmar deleção
 */
export async function handleConfirmDelete(
    data: { slug: string },
    addMessage: AddMessage
): Promise<void> {
    try {
        const result = await fetchArticleBySlug(data.slug);

        if (!result.success) {
            throw new Error('Artigo não encontrado');
        }

        const article = result.data as ApiArticle;

        addMessage(createAssistantMessage(
            `⚠️ **Confirmação de Deleção**\n\n` +
            `Você está prestes a deletar:\n\n` +
            `**Título**: ${article.title}\n` +
            `**Slug**: \`${data.slug}\`\n` +
            `**Publicado em**: ${new Date(article.publishedAt).toLocaleDateString('pt-BR')}\n\n` +
            `⚠️ **Esta ação é IRREVERSÍVEL!**\n\n` +
            `Digite \`SIM\` para confirmar ou \`NÃO\` para cancelar.`
        ));

        window.__pendingDelete = data.slug;
    } catch (error) {
        addMessage(createAssistantMessage(
            `❌ **Erro**: ${getErrorMessage(error)}`
        ));
    }
}

/**
 * Handle: Executar deleção confirmada
 */
export async function handleExecuteDelete(
    slug: string,
    addMessage: AddMessage
): Promise<void> {
    try {
        const result = await deleteArticle(slug);

        if (result.success) {
            addMessage(createAssistantMessage(
                `✅ **Artigo deletado com sucesso!**\n\nSlug: \`${slug}\``
            ));
        } else {
            throw new Error(result.error || 'Erro ao deletar');
        }
    } catch (error) {
        addMessage(createAssistantMessage(
            `❌ **Erro ao deletar**: ${getErrorMessage(error)}`
        ));
    } finally {
        delete window.__pendingDelete;
    }
}
