import fs from 'node:fs'
import path from 'node:path'
import { DrizzleNewEngine } from '@/drizzle/schema'
import { processOpenAi } from './openai'
import { processOpenRouter } from './openrouter'
import { processTogetherAi } from './together'

const date = new Date().toISOString().split('T')[0]!
const dir = path.join(__dirname, `data-${date}`)

export function writeModelResultJsonFile<T extends any>(name: string, data: T) {
  fs.writeFileSync(path.join(dir, name + '.json'), JSON.stringify(data, null, 2))
}

export function getParamSize(text: string) {
  const regex = /\d+(?=B)/g
  const match = text.match(regex)
  if (match) return Number(match[0]) * 1000
  return undefined
}

const modelMainTypes = [
  'chat',
  'completion',
  'instruct',
  'image',
  'textToSpeech',
  'speechToText',
  'embedding',
] as const

export type EngineCreate = DrizzleNewEngine
async function createDbEngines(...records: EngineCreate[][]) {
  for (const engines of records) {
    console.log('creating engines')
    // await prisma.engine.createMany({ data: engines })
  }
}

export async function fetchAndAddProviderModels() {
  // await prisma.engine.deleteMany({})

  console.log('get available models')
  fs.mkdirSync(dir, { recursive: true })

  const e1 = processOpenAi()
  const e2 = await processOpenRouter()
  const e3 = await processTogetherAi(path.join(dir, 'togetherai.response.json'))

  // await createDbEngines(e1, e2, e3)
}

// await fetchAndAddProviderModels()
