import { PrismaClient } from '@prisma/client'

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

  const gpt3_5_turbo = await prisma.engine.upsert({
    where: { id: 'openai::gpt-3.5-turbo' },
    update: {},
    create: {
      id: 'openai::gpt-3.5-turbo',
      type: 'chat',
      model: 'gpt-3.5-turbo',
      hostId: 'openai',
      displayName: 'GPT-3.5-Turbo',
      creatorName: 'OpenAI',
      releaseDate: new Date('01 Mar 2023').toISOString(),
      description:
        'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat completions API but works well for traditional completions tasks as well.',
      url: 'https://openai.com',
      license: 'OpenAI',
      licenseUrl: 'https://openai.com',
      contextLength: 4097,
      parameterSize: '175',
      promptFormat: '',
      stopTokens: JSON.stringify([]),
      hostMaxCompletionTokens: 4097,
      priceInput: '0.0015',
      priceOutput: '0.002',
      includeParameters: JSON.stringify({ model: 'gpt-3.5-turbo', stream: true }),
    },
  })
  console.log('gpt3_5_turbo', gpt3_5_turbo)

  const gpt4 = await prisma.engine.upsert({
    where: { id: 'openai::gpt-4' },
    update: {},
    create: {
      id: 'openai::gpt-4',
      type: 'chat',
      model: 'gpt-4',
      hostId: 'openai',
      displayName: 'GPT-4',
      creatorName: 'OpenAI',
      releaseDate: new Date('14 Mar 2023').toISOString(),
      description:
        'GPT-4 is a large multimodal model (accepting text inputs and emitting text outputs today, with image inputs coming in the future) that can solve difficult problems with greater accuracy than any of our previous models, thanks to its broader general knowledge and advanced reasoning capabilities. Like gpt-3.5-turbo, GPT-4 is optimized for chat but works well for traditional completions tasks using the Chat completions API.',
      url: 'https://openai.com',
      license: 'OpenAI',
      licenseUrl: 'https://openai.com',
      contextLength: 8192,
      parameterSize: '1760',
      promptFormat: '',
      stopTokens: JSON.stringify([]),
      hostMaxCompletionTokens: 8192,
      priceInput: '0.03',
      priceOutput: '0.06',
      includeParameters: JSON.stringify({ model: 'gpt-4', stream: true }),
    },
  })
}

await main()
