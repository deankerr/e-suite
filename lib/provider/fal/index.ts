import { env } from '@/lib/utils'
import createClient from 'openapi-fetch'
import { components, paths } from './illusion-diffusion.d'

const { POST } = createClient<paths>({
  baseUrl: 'https://54285744-illusion-diffusion.gateway.alpha.fal.ai/',
  headers: {
    Authorization: `Key ${env('FALAI_API_KEY')}`,
  },
})

type Input = components['schemas']['IllusionDiffusionInput']

export async function illusion(body: Input) {
  const { data, error } = await POST('/', { body })

  if (data) {
    return data
  } else {
    console.error(error)
    throw new Error('illu fail')
  }
}
