import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
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
  if (match) return match[0] + '000000000'
  return undefined
}

export function dollarsToNanoUSD(dollars: number) {
  return (dollars / 4000) * 1_000_000_000
}

export function nanoUSDToDollars(nano: number) {
  return (nano * 4000) / 1_000_000_000
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

export type EngineCreate = Prisma.EngineCreateManyInput
async function createDbEngines(...records: EngineCreate[][]) {
  for (const engines of records) {
    for (const engine of engines) {
      const e = await prisma.engine.create({ data: engine })
      console.log('created:', e)
    }
  }
}

export async function fetchAndAddProviderModels() {
  await prisma.engine.deleteMany({})

  console.log('get available models')
  fs.mkdirSync(dir, { recursive: true })

  const e1 = processOpenAi()
  const e2 = await processOpenRouter()
  const e3 = await processTogetherAi(path.join(dir, 'togetherai.response.json'))

  await createDbEngines(e1, e2, e3)
}

// await fetchAndAddProviderModels()
