/**
 * Seed Data para Schema v2
 * Popula banco de dados com dados de teste
 */

import { PrismaClient } from '../lib/generated/prisma-v2'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with v2 schema...')

  // 1. Create Users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const editorPassword = await bcrypt.hash('editor123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tokenmilagre.com' },
    update: {},
    create: {
      email: 'admin@tokenmilagre.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  const editor = await prisma.user.upsert({
    where: { email: 'editor@tokenmilagre.com' },
    update: {},
    create: {
      email: 'editor@tokenmilagre.com',
      password: editorPassword,
      name: 'Editor User',
      role: 'EDITOR',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Users created')

  // 2. Create Categories
  const categories = [
    { slug: 'bitcoin', name: 'Bitcoin', type: 'news', icon: 'bitcoin', color: '#F7931A' },
    { slug: 'ethereum', name: 'Ethereum', type: 'news', icon: 'ethereum', color: '#627EEA' },
    { slug: 'defi', name: 'DeFi', type: 'news', icon: 'coins', color: '#8B5CF6' },
    { slug: 'blockchain', name: 'Blockchain', type: 'educational', icon: 'link', color: '#3B82F6' },
    { slug: 'trading', name: 'Trading', type: 'educational', icon: 'chart-line', color: '#10B981' },
    { slug: 'seguranca', name: 'Segurança', type: 'educational', icon: 'shield', color: '#EF4444' },
  ]

  const createdCategories = await Promise.all(
    categories.map(cat =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  )

  console.log('✅ Categories created')

  // 3. Create Tags
  const tags = [
    'bitcoin', 'ethereum', 'defi', 'nft', 'staking',
    'trading', 'blockchain', 'cripto', 'investimento', 'seguranca'
  ]

  const createdTags = await Promise.all(
    tags.map(tag =>
      prisma.tag.upsert({
        where: { slug: tag },
        update: {},
        create: { slug: tag, name: tag.charAt(0).toUpperCase() + tag.slice(1) },
      })
    )
  )

  console.log('✅ Tags created')

  // 4. Create Sample Article
  const article = await prisma.article.create({
    data: {
      slug: 'bitcoin-atinge-100k-marco-historico',
      title: 'Bitcoin Atinge US$ 100 mil em Marco Histórico',
      excerpt: 'A criptomoeda mais famosa do mundo alcançou pela primeira vez a marca dos US$ 100 mil, marcando um momento histórico no mercado de ativos digitais.',
      content: `## Fato Central

O Bitcoin atingiu hoje o marco histórico de US$ 100.000, estabelecendo um novo recorde de todos os tempos. Esta é a primeira vez que a criptomoeda alcança esse patamar desde seu lançamento em 2009.

## Contexto e Números

Nos últimos 12 meses, o Bitcoin valorizou mais de 150%, impulsionado pela aprovação de ETFs de Bitcoin spot nos Estados Unidos e crescente adoção institucional.

## Impacto no Mercado

A valorização do Bitcoin impactou positivamente todo o mercado de criptomoedas, com altcoins também registrando ganhos significativos.

## Visão de Especialistas

Analistas do setor apontam que este é apenas o começo de um novo ciclo de alta, com previsões de que o Bitcoin pode alcançar US$ 150 mil ainda este ano.

## Perspectivas Futuras

Apesar do otimismo, especialistas alertam para a volatilidade inerente ao mercado de criptomoedas e recomendam cautela aos investidores.

### Conclusão

O marco de US$ 100 mil representa um momento significativo para o Bitcoin e para todo o ecossistema de criptomoedas, sinalizando uma nova era de adoção e valorização.`,
      type: 'news',
      status: 'published',
      sentiment: 'positive',
      readTime: '5 min',
      authorId: admin.id,
      categoryId: createdCategories[0].id, // Bitcoin
      publishedAt: new Date(),
      tags: {
        create: [
          { tagId: createdTags[0].id }, // bitcoin
          { tagId: createdTags[7].id }, // cripto
          { tagId: createdTags[8].id }, // investimento
        ],
      },
      citations: {
        create: [
          {
            url: 'https://www.coindesk.com',
            title: 'Bitcoin Reaches $100k',
            domain: 'coindesk.com',
            order: 0,
          },
          {
            url: 'https://www.bloomberg.com',
            title: 'Historic Milestone for Crypto',
            domain: 'bloomberg.com',
            order: 1,
          },
        ],
      },
    },
  })

  console.log('✅ Sample article created')

  console.log('🎉 Seeding completed successfully!')
  console.log(`
📊 Summary:
- Users: 2 (admin, editor)
- Categories: ${categories.length}
- Tags: ${tags.length}
- Articles: 1
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
