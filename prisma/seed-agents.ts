import { prisma } from '@/lib/prisma'

export async function seedAgents() {
  console.log('create agents')
  const user = await prisma.user.findFirst({})
  if (!user) {
    console.log('unable to seed agents because there are no users')
    return
  }

  const ag1 = await prisma.agent.upsert({
    where: {
      id: 'seed-ag1',
    },
    update: {},
    create: {
      id: 'seed-ag1',
      owner: {
        connect: {
          id: user.id,
        },
      },
      name: 'Artemis',
      image: 'dp1.png',
      engine: {
        connect: {
          id: 'openai@gpt-3.5-turbo',
        },
      },
    },
  })

  const ag2 = await prisma.agent.create({
    data: {
      id: 'seed-ag2',
      ownerId: user.id,
      name: 'Charon',
      image: 'dp2.png',
      engineId: 'openrouter@airoboros-l2-70b',
    },
  })

  const ag3 = await prisma.agent.create({
    data: {
      id: 'seed-ag3',
      ownerId: user.id,
      name: 'Dionysus',
      image: 'dp3.png',
      engineId: 'togetherai@redpajama-incite-7b-chat',
    },
  })

  const ag4 = await prisma.agent.create({
    data: {
      id: 'seed-ag4',
      ownerId: user.id,
      name: 'Piñata',
      image: 'dp4.png',
      engineId: 'openrouter@mistral-7b-openorca',
    },
  })

  console.log(ag1, ag2, ag3, ag4)
}
