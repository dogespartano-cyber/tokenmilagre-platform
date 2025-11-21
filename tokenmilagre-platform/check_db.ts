
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking Resources...')
    const resources = await prisma.resource.findMany()
    console.log(`Found ${resources.length} resources:`)
    resources.forEach(r => console.log(`- ${r.name} (Verified: ${r.verified}, Category: ${r.category})`))

    console.log('\nChecking Articles...')
    const articles = await prisma.article.findMany({
        take: 5,
        select: { id: true, title: true, type: true, level: true }
    })
    console.log(`Found ${articles.length} articles (showing first 5):`)
    articles.forEach(a => console.log(`- ${a.title} (Type: ${a.type}, Level: ${a.level})`))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
