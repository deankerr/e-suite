import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const openai = await prisma.host.upsert({
    where: { id: 'openai' },
    update: {},
    create: {
      id: 'openai',
      displayName: 'OpenAI',
      link: 'https://openai.com',
    },
  })
  console.log('openai', openai)

  const openrouter = await prisma.host.upsert({
    where: { id: 'openrouter' },
    update: {},
    create: {
      id: 'openrouter',
      displayName: 'OpenRouter',
      link: 'https://openrouter.ai/',
    },
  })

  const togetherai = await prisma.host.upsert({
    where: { id: 'togetherai' },
    update: {},
    create: {
      id: 'togetherai',
      displayName: 'Together.ai',
      link: 'https://together.ai/',
    },
  })

  const replicate = await prisma.host.upsert({
    where: { id: 'replicate' },
    update: {},
    create: {
      id: 'replicate',
      displayName: 'Replicate',
      link: 'https://replicate.com/',
    },
  })

  const fal = await prisma.host.upsert({
    where: { id: 'fal' },
    update: {},
    create: {
      id: 'fal',
      displayName: 'Fal',
      link: 'https://www.fal.ai/',
    },
  })

  const gpt3_5_turbo = await prisma.engine.upsert({
    where: { id: 'openai::gpt-3.5-turbo' },
    update: {},
    create: {
      id: 'openai::gpt-3.5-turbo',
      type: 'chat',
      modelId: 'gpt-3.5-turbo',
      hostId: 'openai',
      displayName: 'GPT-3.5-Turbo',
      creatorName: 'OpenAI',
      releaseDate: new Date('01 Mar 2023').toISOString(),
      description:
        'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat completions API but works well for traditional completions tasks as well.',
      link: 'https://openai.com',
      license: 'OpenAI',
      licenseLink: 'https://openai.com',
      isOpenSource: false,
      contextLength: 4097,
      parametersSize: 'unknown',
      promptFormat: '',
      stopTokens: '',
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
      modelId: 'gpt-4',
      hostId: 'openai',
      displayName: 'GPT-4',
      creatorName: 'OpenAI',
      releaseDate: new Date('14 Mar 2023').toISOString(),
      description:
        'GPT-4 is a large multimodal model (accepting text inputs and emitting text outputs today, with image inputs coming in the future) that can solve difficult problems with greater accuracy than any of our previous models, thanks to its broader general knowledge and advanced reasoning capabilities. Like gpt-3.5-turbo, GPT-4 is optimized for chat but works well for traditional completions tasks using the Chat completions API.',
      link: 'https://openai.com',
      license: 'OpenAI',
      licenseLink: 'https://openai.com',
      isOpenSource: false,
      contextLength: 8192,
      parametersSize: 'unknown',
      promptFormat: '',
      stopTokens: '',
      includeParameters: JSON.stringify({ model: 'gpt-4', stream: true }),
    },
  })

  const OR_llama2 = await prisma.engine.upsert({
    where: { id: 'openrouter::llama-2-70b-chat' },
    update: {},
    create: {
      id: 'openrouter::llama-2-70b-chat',
      type: 'chat',
      modelId: 'llama-2-70b-chat',
      hostId: 'openrouter',
      displayName: 'LLaMA-2 Chat (70B)',
      creatorName: 'Meta',
      releaseDate: new Date('18 July 2023').toISOString(),
      description:
        'Llama 2-chat leverages publicly available instruction datasets and over 1 million human annotations. Available in three sizes: 7B, 13B and 70B parameters.',
      link: 'https://huggingface.co/togethercomputer/llama-2-70b-chat',
      license: 'LLaMA license Agreement (Meta)',
      licenseLink: 'https://huggingface.co/togethercomputer/llama-2-70b-chat',
      isOpenSource: true,
      contextLength: 4096,
      parametersSize: '70 billion',
      promptFormat: '',
      stopTokens: '',
      includeParameters: JSON.stringify({ model: 'meta-llama/llama-2-70b-chat', stream: true }),
    },
  })
}

await main()
