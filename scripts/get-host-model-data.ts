import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { join } from 'node:path'
import { adapters } from '@/lib/api/adapters'
import { PlatformKeys } from '@/lib/api/schemas'

const dataDir = 'data'
const fileExt = '.modelcache.json'

async function getHostModelData(provider: PlatformKeys) {
  const path = join(dataDir, provider + fileExt)

  if (existsSync(path)) {
    console.log(provider + ': reusing cached data')
    return
  }

  const data = await adapters[provider].models()
  await fs.writeFile(path, JSON.stringify(data, null, 2))
  console.log(provider + ': model cache updated')
}
