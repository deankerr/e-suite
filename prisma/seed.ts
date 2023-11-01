import { PrismaClient } from '@prisma/client'
import { seedEngineData } from './seed-engines'

const prisma = new PrismaClient()

async function main() {
  const openai = await prisma.host.upsert({
    where: { id: 'openai' },
    update: {},
    create: {
      id: 'openai',
      displayName: 'OpenAI',
      url: 'https://openai.com',
    },
  })

  const openrouter = await prisma.host.upsert({
    where: { id: 'openrouter' },
    update: {},
    create: {
      id: 'openrouter',
      displayName: 'OpenRouter',
      url: 'https://openrouter.ai/',
    },
  })

  const togetherai = await prisma.host.upsert({
    where: { id: 'togetherai' },
    update: {},
    create: {
      id: 'togetherai',
      displayName: 'Together.ai',
      url: 'https://together.ai/',
    },
  })

  const replicate = await prisma.host.upsert({
    where: { id: 'replicate' },
    update: {},
    create: {
      id: 'replicate',
      displayName: 'Replicate',
      url: 'https://replicate.com/',
    },
  })

  const fal = await prisma.host.upsert({
    where: { id: 'fal' },
    update: {},
    create: {
      id: 'fal',
      displayName: 'Fal',
      url: 'https://www.fal.ai/',
    },
  })

  await seedEngineData()
}

await main()
