import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/route'
import { Credentials, listModels } from '@huggingface/hub'
import { HfInference, Options, textGeneration } from '@huggingface/inference'
import { huggingfaceSchema } from './huggingface.schema'

const credentials: Credentials = { accessToken: ENV.HUGGING_FACE_API_KEY }

const hf = new HfInference(ENV.HUGGING_FACE_API_KEY, { dont_load_model: true })

export const huggingfacePlugin = {
  chat: {
    completions: async (ctx: RouteContext) => {
      const body = huggingfaceSchema.chat.completions.request.parse(ctx.input)
      const response = await hf.textGeneration(body)

      return Response.json(response.generated_text)
    },
  },

  models: {
    search: async () => {
      let n = 50
      for await (const model of listModels({ search: { task: 'conversational' }, credentials })) {
        console.log('Model: %o', model)
        if (n-- <= 0) break
      }
    },
  },
}
