import fs from 'node:fs'
import path from 'node:path'
import { models } from '@/lib/api/platforms/openai.adapters'
import z from 'zod'

const schema = z
  .array(
    z
      .object({
        id: z.string(),
        object: z.string(),
        created: z.number(),
        owned_by: z.string(),
      })
      .strict(),
  )
  .transform((data) => data.map((item) => item.id))

async function fetchModels() {
  const data = await models()
  fs.writeFileSync(path.join(__dirname, 'openai.1.response.json'), JSON.stringify(data, null, 2))
  return data
}

async function refine(data: unknown) {
  const ids = schema.parse(data).sort()

  fs.writeFileSync(path.join(__dirname, 'openai.2.list.json'), JSON.stringify(ids, null, 2))

  const categories = {
    chat: [] as string[],
    instruct: [] as string[],
    image: [] as string[],
    textToSpeech: [] as string[],
    speechToText: [] as string[],
    embedding: [] as string[],
    legacy: [] as string[],
    unknown: [] as string[],
  }

  for (const id of ids) {
    if (id.includes('embedding')) categories.embedding.push(id)
    else if (id.includes('tts')) categories.textToSpeech.push(id)
    else if (id.includes('whisper')) categories.speechToText.push(id)
    else if (id.includes('dall')) categories.image.push(id)
    else if (id.includes('gpt')) {
      if (id.includes('instruct')) categories.instruct.push(id)
      else categories.chat.push(id)
    } else if (['ada', 'babbage', 'curie', 'davinci'].some((i) => id.includes(i)))
      categories.legacy.push(id)
    else categories.unknown.push(id)
  }

  fs.writeFileSync(
    path.join(__dirname, 'openai.3.categories.json'),
    JSON.stringify(categories, null, 2),
  )
}

async function main() {
  const data = await fetchModels()
  await refine(data)
}

main().then(() => console.log('Done'))
