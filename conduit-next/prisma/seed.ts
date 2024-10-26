const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const passwordHash = await hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'jake@jake.jake' },
    update: {},
    create: {
      email: 'jake@jake.jake',
      username: 'jake',
      passwordHash,
      bio: 'I work at statefarm',
      image: 'https://i.stack.imgur.com/xHWG8.jpg'
    },
  })

  // Create some tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'dragons' },
      update: {},
      create: { name: 'dragons' }
    }),
    prisma.tag.upsert({
      where: { name: 'training' },
      update: {},
      create: { name: 'training' }
    }),
  ])

  // Create some articles
  await prisma.article.upsert({
    where: { slug: 'how-to-train-your-dragon' },
    update: {},
    create: {
      title: 'How to train your dragon',
      description: 'Ever wonder how?',
      body: 'Very carefully.',
      slug: 'how-to-train-your-dragon',
      authorId: user.id,
      tagList: {
        connect: tags.map(tag => ({ id: tag.id }))
      }
    }
  })

  await prisma.article.upsert({
    where: { slug: 'how-to-train-your-dragon-2' },
    update: {},
    create: {
      title: 'How to train your dragon 2',
      description: 'So toothless...',
      body: 'It takes a lot of patience',
      slug: 'how-to-train-your-dragon-2',
      authorId: user.id,
      tagList: {
        connect: tags.map(tag => ({ id: tag.id }))
      }
    }
  })

  console.log('Database has been seeded.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
