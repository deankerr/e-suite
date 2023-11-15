import { fetchAndAddProviderModels } from '@/scripts/provider-models/run'
import { PrismaClient } from '@prisma/client'
import { seedAgents } from './seed-agents'
import { seedEngineData } from './seed-engines'

const prisma = new PrismaClient()

await fetchAndAddProviderModels()

async function main() {
  console.log('add Providers')
  await prisma.provider.upsert({
    where: { id: 'openai' },
    update: {},
    create: {
      id: 'openai',
      displayName: 'OpenAI',
      url: 'https://openai.com',
    },
  })

  await prisma.provider.upsert({
    where: { id: 'openrouter' },
    update: {},
    create: {
      id: 'openrouter',
      displayName: 'OpenRouter',
      url: 'https://openrouter.ai/',
    },
  })

  await prisma.provider.upsert({
    where: { id: 'togetherai' },
    update: {},
    create: {
      id: 'togetherai',
      displayName: 'Together.ai',
      url: 'https://together.ai/',
    },
  })

  await prisma.provider.upsert({
    where: { id: 'replicate' },
    update: {},
    create: {
      id: 'replicate',
      displayName: 'Replicate',
      url: 'https://replicate.com/',
    },
  })

  await prisma.provider.upsert({
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

// const env = process.env.SEED

// if (!env) {
//   console.error('no SEED env provided')
// }

// if (env === 'engines') await main()
// if (env === 'agents') await seedAgents()
