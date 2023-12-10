import { vendorIdSchema } from '@/data/schemas'
import { NewAppError } from '@/lib/app-error'
import { route } from '@/lib/route'
import { falPlugin } from '@/plugins/fal.plugin'
import { openaiPlugin } from '@/plugins/openai.plugin'
import { openaiSchema } from '@/plugins/openai.schema'
import { replicatePlugin } from '@/plugins/replicate.plugin'
import { togetheraiPlugin } from '@/plugins/togetherai.plugin'
import z from 'zod'

export const runtime = 'edge'

const imageGenerationRequestSchema = openaiSchema.image.generations.request
  .merge(z.object({ vendorId: vendorIdSchema }))
  .passthrough()
  .describe('/images/generations input')

export const POST = route({
  access: 'authorized',
  input: imageGenerationRequestSchema,
  handler: async (ctx) => {
    if (ctx.input.vendorId === 'openai') return await openaiPlugin.images.generations(ctx)
    if (ctx.input.vendorId === 'fal') return await falPlugin.images.generations(ctx)
    if (ctx.input.vendorId === 'togetherai') return await togetheraiPlugin.images.generations(ctx)
    if (ctx.input.vendorId === 'replicate') return await replicatePlugin.images.generations(ctx)
    throw new NewAppError('vendor_method_not_supported')
  },
})
