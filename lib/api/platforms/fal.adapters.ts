import { _deprecated_env } from '@/lib/utils'
import createClient from 'openapi-fetch'
import { components, paths } from './fal.illusion-diffusion'

const client = createClient<paths>({
  baseUrl: 'https://54285744-illusion-diffusion.gateway.alpha.fal.ai/',
  headers: {
    Authorization: `Key ${_deprecated_env('FALAI_API_KEY')}`,
  },
})

type Input = components['schemas']['IllusionDiffusionInput']

export const fal = {
  async illusion(body: Input) {
    const { data, error } = await client.POST('/', { body })

    if (error) {
      console.error(error, 'fal illusion')
      throw new Error('fal illusion')
    }

    const response = data
    const item = data.image.url
    return { response, item }
  },
}
