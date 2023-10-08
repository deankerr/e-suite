import { env, raise } from '@/lib/utils'
import createClient from 'openapi-fetch'
import { z } from 'zod'
import { paths } from './togetherai'

const { POST } = createClient<paths>({
  baseUrl: 'https://api.together.xyz',
  headers: {
    Authorization: `Bearer ${env('TOGETHERAI_API_KEY')}`,
  },
})

export const togetherai = {
  async image(input: object) {
    // api spec is missing image parameters
    const { data, error } = await POST('/inference', { body: input })
    if (data) {
      const response = imageResponseSchema.parse(data)
      const base64 =
        response.output.choices[0]?.image_base64 ?? raise('response missing expected data')
      return { response, item: { base64 } }
    } else {
      console.error(error)
      throw new Error('Unknown togetherai error')
    }
  },
}

const imageResponseSchema = z.object({
  status: z.string(),
  prompt: z.string().array(),
  model: z.string(),
  model_owner: z.string(),
  tags: z.object({}).passthrough(), // ?
  num_returns: z.number(),
  args: z.object({}).passthrough(), // ? request params
  subjobs: z.unknown().array(), // ?
  output: z.object({
    choices: z.array(
      z.object({
        image_base64: z.string(),
      }),
    ),
    result_type: z.string(),
  }),
})
