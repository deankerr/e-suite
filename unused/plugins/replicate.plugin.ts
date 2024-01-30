import 'server-only'
import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/route'
import Replicate from 'replicate'
import { replicateSchema } from './replicate.schema'

//* https://github.com/replicate/replicate-javascript#readme
const api = new Replicate({ auth: ENV.REPLICATE_API_KEY, userAgent: ENV.APP_NAME })

export const replicatePlugin = {
  images: {
    generations: async (ctx: RouteContext) => {
      const { model, ...input } = replicateSchema.images.generations.request.parse(ctx.input)
      ctx.log.add('vendorRequestBody', { model, input })

      const result = await api.run(model as `${string}/${string}:${string}`, { input })
      ctx.log.add('vendorResponseBody', result)

      const parsed = replicateSchema.images.generations.response.parse(result)
      const response = {
        created: Date.now(),
        data: parsed.map((item) => ({
          url: item,
        })),
      }

      ctx.log.add('responseBody', response)
      return Response.json(response)
    },
  },

  models: async () => {
    const data = await api.collections.list()
  },
}
