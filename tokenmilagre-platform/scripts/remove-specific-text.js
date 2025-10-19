#!/usr/bin/env node

const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

// Texto exato a ser removido
const TEXT_TO_REMOVE = ` O mercado de criptomoedas foi abalado em 17 de outubro de 2025, quando o Bitcoin (BTC) registrou uma queda significativa, atingindo a marca de aproximadamente US$105.000. Este movimento de preço desencadeou uma onda de liquidações em massa, com estimativas variando entre US$800 milhões e US$1.2 bilhão em posições de criptoativos sendo eliminadas, impactando severamente traders alavancados.

Principais Destaques
Queda do Bitcoin e Impacto nos Traders Alavancados
A recente desvalorização do Bitcoin para a faixa dos US$105.000 pegou muitos investidores de surpresa. Analistas sugerem que a principal causa para a magnitude das liquidações foi a alta alavancagem de traders no mercado de derivativos. Com a queda abrupta, posições longas foram forçadas a fechar, exacerbando a pressão vendedora e contribuindo para a espiral descendente.

Volume de Liquidações Atinge Bilhões
Dados recentes indicam que o volume total de liquidações no mercado de criptoativos, impulsionado pela queda do Bitcoin, alcançou cifras alarmantes. Enquanto algumas fontes reportam cerca de US$800 milhões em liquidações, outras apontam para um montante ainda maior, superando US$1.2 bilhão. Este evento sublinha a volatilidade inerente ao mercado e os riscos associados à negociação com alavancagem.

Fatores Macroeconômicos Contribuem para a Volatilidade
A instabilidade no mercado cripto não pode ser atribuída apenas a fatores internos. Fontes do mercado reportam que tensões geopolíticas crescentes, preocupações comerciais entre os Estados Unidos e a China, e a possibilidade de um desligamento do governo dos EUA contribuíram para um ambiente de maior aversão ao risco. Adicionalmente, o estresse contínuo em bancos regionais dos EUA também é citado como um fator que pressionou o preço do Bitcoin para baixo.

Análise de Mercado
A recente performance do Bitcoin reflete uma fase de consolidação e correção após períodos de alta. A pressão vendedora observada é um indicativo de que investidores estão reagindo a um cenário macroeconômico incerto e a uma reavaliação dos riscos no espaço cripto. A liquidação de posições alavancadas é um mecanismo natural de purificação do mercado, mas que resulta em perdas significativas para muitos participantes.

Dados recentes indicam:

Volume: O volume de negociação aumentou durante a queda, refletindo a intensa atividade de compra e venda.
Preço: O preço do Bitcoin demonstrou um movimento de baixa acentuado, rompendo níveis de suporte importantes.
Market Cap: A capitalização de mercado total das criptomoedas sofreu uma contração, refletindo a saída de capital do setor.
Perspectivas Futuras
Analistas sugerem que o mercado pode enfrentar um período de maior cautela e menor apetite por risco no curto prazo. A recuperação dependerá da estabilização dos fatores macroeconômicos e de uma diminuição da incerteza regulatória. No entanto, a resiliência do Bitcoin em ciclos anteriores sugere que, a longo prazo, a criptomoeda pode se recuperar, atraindo novos investidores em busca de valor.

Conclusão
A queda do Bitcoin para US$105.000 e as subsequentes liquidações de centenas de milhões de dólares servem como um lembrete da natureza volátil do mercado de criptomoedas. Embora doloroso para muitos, este evento destaca a importância da gestão de risco e da cautela, especialmente em um cenário global de incertezas econômicas e geopolíticas.

📊 Sobre Este Artigo

Publicado por $MILAGRE Research | Última atualização: 17/10/2025

Este conteúdo é educacional e informativo, baseado em fontes verificadas do mercado cripto. Não constitui aconselhamento financeiro ou recomendação de investimento. Criptomoedas envolvem riscos - sempre conduza sua própria pesquisa (DYOR).

Participe da Discussão
O que você acha sobre este tema? Compartilhe sua opinião com a comunidade $MILAGRE!

Discord $MILAGRE
Telegram $MILAGRE
Quer aprender mais sobre Bitcoin e reservas nacionais?

Explore nossa Biblioteca Educacional $MILAGRE
Fontes Consultadas
$MILAGRE Research `;

function hasTextToRemove(content) {
  return content.includes('O mercado de criptomoedas foi abalado em 17 de outubro de 2025');
}

function removeText(content) {
  if (!hasTextToRemove(content)) {
    return { modified: false, content };
  }

  // Remove o texto exato
  const modifiedContent = content.replace(TEXT_TO_REMOVE, '');

  return { modified: true, content: modifiedContent };
}

async function updateAllArticles() {
  try {
    console.log('🔍 Buscando artigos no banco de dados...\n');

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Total de artigos: ${articles.length}\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const article of articles) {
      try {
        const result = removeText(article.content);

        if (result.modified) {
          await prisma.article.update({
            where: { id: article.id },
            data: { content: result.content }
          });
          console.log(`✅ Atualizado: "${article.title}"`);
          updated++;
        } else {
          console.log(`⏭️  Sem texto: "${article.title}"`);
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Erro em "${article.title}": ${error.message}`);
        errors++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Artigos atualizados: ${updated}`);
    console.log(`⏭️  Artigos sem o texto: ${skipped}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📊 Total processado: ${articles.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
console.log('\n🚀 Iniciando remoção de texto específico...\n');
updateAllArticles();
