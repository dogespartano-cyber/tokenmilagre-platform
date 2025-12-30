
import { regulacaoArticles } from '../prisma/seeds/generated-regulacao-articles';

const article = regulacaoArticles.find(a => a.slug === 'regulacao-cripto-mundial');

if (article) {
    console.log('--- CONTENT START ---');
    console.log(JSON.stringify(article.content));
    console.log('--- CONTENT END ---');
} else {
    console.log('Article not found');
}
