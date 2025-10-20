const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

const educationalArticles = [
  {
    slug: 'introducao-ao-blockchain',
    title: 'Introdução ao Blockchain: Entenda a Tecnologia por Trás das Criptomoedas',
    excerpt: 'Aprenda os fundamentos da tecnologia blockchain de forma simples e prática.',
    category: 'blockchain',
    level: 'iniciante',
    contentType: 'Artigo',
    readTime: '8 min',
    tags: JSON.stringify(['básico', 'blockchain', 'conceitos']),
    publishedAt: '2025-01-15',
    content: `A tecnologia blockchain revolucionou a forma como pensamos sobre transações digitais e descentralização. Se você está começando no mundo das criptomoedas, entender blockchain é fundamental para compreender como Bitcoin, Ethereum e outras moedas digitais funcionam.

## O Que É Blockchain?

Blockchain, ou "cadeia de blocos" em português, é um livro-razão digital distribuído que registra transações de forma permanente e transparente. Imagine um caderno que nunca pode ser apagado e que todos podem consultar, mas ninguém pode alterar sozinho.

A principal característica do blockchain é sua descentralização. Não existe uma autoridade central controlando os dados. Em vez disso, milhares de computadores ao redor do mundo mantêm cópias idênticas desse registro, garantindo segurança e confiabilidade.

## Como Funciona na Prática

Quando você realiza uma transação com criptomoedas, ela passa por um processo específico:

- A transação é transmitida para uma rede de computadores espalhados pelo mundo
- Mineradores ou validadores verificam se a transação é legítima
- Após validação, a transação é agrupada com outras em um "bloco"
- Esse bloco é adicionado à cadeia existente de blocos anteriores
- O registro se torna permanente e visível para todos na rede

Cada bloco contém três elementos essenciais: os dados das transações, um timestamp (marca temporal) e uma referência criptográfica ao bloco anterior. É essa conexão entre blocos que forma a "cadeia" e torna o sistema praticamente impossível de hackear.

## Por Que Blockchain É Seguro

A segurança do blockchain vem de sua estrutura matemática e distribuída. Para alterar uma transação antiga, um atacante precisaria modificar não apenas aquele bloco específico, mas todos os blocos subsequentes em mais da metade dos computadores da rede simultaneamente. Na prática, isso é computacionalmente impossível em blockchains estabelecidos como Bitcoin.

Além disso, a criptografia garante que apenas o dono das chaves privadas possa autorizar transações. É como ter uma senha ultra-segura que ninguém mais conhece.

## Tipos de Blockchain

Existem diferentes tipos de blockchain para diferentes necessidades:

**Blockchain Público:** Qualquer pessoa pode participar, visualizar transações e validar blocos. Bitcoin e Ethereum são exemplos.

**Blockchain Privado:** O acesso é restrito a participantes autorizados. Usado por empresas para controle interno.

**Blockchain Híbrido:** Combina elementos públicos e privados, oferecendo flexibilidade para diferentes casos de uso.

## Além das Criptomoedas

Embora blockchain seja mais conhecido pelas criptomoedas, suas aplicações vão muito além. A tecnologia está sendo explorada em:

- Rastreamento de cadeias de suprimentos
- Registros médicos seguros
- Sistemas de votação eletrônica
- Contratos inteligentes que se executam automaticamente
- Certificação de documentos e diplomas

## Conceitos Importantes Para Memorizar

**Hash:** Uma impressão digital única e criptografada de cada bloco que garante sua integridade.

**Mineração:** O processo de validar transações e adicionar novos blocos através da resolução de problemas matemáticos complexos.

**Nodes (Nós):** Os computadores que mantêm cópias do blockchain e participam da rede.

**Consenso:** O mecanismo que permite que todos os participantes concordem sobre o estado atual do blockchain sem uma autoridade central.

## Começando Sua Jornada

Para aprofundar seu conhecimento em blockchain, comece explorando as principais criptomoedas e como funcionam suas redes. Experimente criar uma carteira digital, entenda como funciona uma transação real e acompanhe projetos que utilizam contratos inteligentes.

Lembre-se: blockchain é uma tecnologia em constante evolução. Mantenha-se atualizado sobre novas aplicações e desenvolvimentos, pois essa área está moldando o futuro das transações digitais e da internet como conhecemos.`
  }
  // Artigo 2 será adicionado a seguir...
];

async function main() {
  console.log('🚀 Iniciando migração de artigos educacionais...\n');

  // Buscar ID do usuário Editor
  const editor = await prisma.user.findUnique({
    where: { email: 'editor@tokenmilagre.xyz' }
  });

  if (!editor) {
    console.error('❌ Usuário editor não encontrado!');
    process.exit(1);
  }

  console.log(`✅ Usuário editor encontrado: ${editor.email} (${editor.id})\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const article of educationalArticles) {
    try {
      // Verificar se já existe
      const existing = await prisma.article.findUnique({
        where: { slug: article.slug }
      });

      if (existing) {
        console.log(`⏭️  Artigo já existe: ${article.slug}`);
        skipCount++;
        continue;
      }

      // Criar artigo educacional
      const created = await prisma.article.create({
        data: {
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          level: article.level,
          contentType: article.contentType,
          readTime: article.readTime,
          tags: article.tags,
          type: 'educational', // Importante: marcar como educacional
          published: true,
          authorId: editor.id,
          createdAt: new Date(article.publishedAt),
          updatedAt: new Date(article.publishedAt)
        }
      });

      console.log(`✅ Artigo criado: ${created.title}`);
      console.log(`   📝 Slug: ${created.slug}`);
      console.log(`   🔗 URL: /educacao/${created.slug}\n`);
      successCount++;

    } catch (error) {
      console.error(`❌ Erro ao criar artigo ${article.slug}:`, error.message);
    }
  }

  console.log('\n📊 Resumo da migração:');
  console.log(`   ✅ Criados: ${successCount}`);
  console.log(`   ⏭️  Ignorados (já existem): ${skipCount}`);
  console.log(`   📚 Total processado: ${educationalArticles.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
