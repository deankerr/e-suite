import fs from 'node:fs/promises'

// pnpm tsx --env-file=".env.local" scripts/fetch-togetherai-models.ts

const apiKey = process.env.TOGETHERAI_API_KEY
async function main() {
  if (!apiKey) throw new Error('apiKey is undefined')

  const res = await fetch('https://api.together.xyz/models/info', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  const json = await res.json()
  await fs.writeFile('scripts/togetherai-models-data.json', JSON.stringify(json, null, 2))
}

main()
  .then(() => console.log('done'))
  .catch((error) => console.error(error))
