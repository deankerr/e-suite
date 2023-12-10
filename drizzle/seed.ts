import {  vendorModelListData, vendors } from './database.schema'
import { createLocalClient } from './local-client'

const db = createLocalClient()

async function seed() {
  // await db.insert(vendorModelListData).values({ vendorId: 'test', data: { a: 'a' } })
  // const storedVendors = await db
  //   .insert(vendors)
  //   .values([
  //     { id: 'openai', displayName: 'OpenAI', url: 'https://openai.com' },
  //     { id: 'openrouter', displayName: 'OpenRouter', url: 'https://openrouter.ai/' },
  //     { id: 'togetherai', displayName: 'Together.ai', url: 'https://together.ai/' },
  //     { id: 'replicate', displayName: 'Replicate', url: 'https://replicate.com/' },
  //     { id: 'fal', displayName: 'Fal', url: 'https://www.fal.ai/' },
  //   ])
  //   .returning()
  //   .all()

  // console.log('Inserted', storedVendors.length, 'vendors')

  // const engineData = engineDataJson.map((e) => ({
  //   ...e,
  //   isAvailable: true,
  //   isRestricted: e.isRestricted ?? false,
  // }))

  // const storedEngines = await db.insert(engines).values(engineData).returning().all()

  // console.log('Inserted', storedEngines.length, 'engines')

  process.exit(0)
}

seed()
