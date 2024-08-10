import { v } from 'convex/values'
import ky from 'ky'
import * as vb from 'valibot'
import { z } from 'zod'

import { api, internal } from '../_generated/api'
import { logActionOpsEvent } from '../db/admin/events'
import { shapeChatModel } from '../db/models'
import { internalAction } from '../functions'
import { ENV } from '../lib/env'

import type { ActionCtx } from '../_generated/server'

const endpoint = 'together'

const processModelRecords = async (
  ctx: ActionCtx,
  records: z.infer<typeof ApiModelsResponse>,
  replace = false,
) => {
  const existingModels = await ctx.runQuery(api.db.models.listChatModels, { endpoint })
  const availabilityCheck = new Set(existingModels.map((m) => m.resourceKey))
  console.info(endpoint, 'existing models', existingModels.length)

  for (const record of records) {
    try {
      const parsed = ApiModelRecord.parse(record)
      // * only featured models are available
      if (!parsed.isFeaturedModel) continue

      // * build model shape
      const shape = shapeChatModel({
        endpoint,
        name: parsed.display_name,
        description: parsed.description,
        creatorName: parsed.creator_organization,
        link: parsed.link ?? '',
        license: parsed.license,
        tags: [],
        modelId: parsed.name,
        endpointModelId: parsed.name,
        pricing: {
          type: 'llm',
          tokenInput: parsed.pricing.input / 250,
          tokenOutput: parsed.pricing.output / 250,
        },
        moderated: false,
        available: true,
        hidden: false,
        internalScore: 0,
        contextLength: parsed.context_length ?? 0,
        tokenizer: '',
        numParameters:
          parsed.num_parameters && Number(parsed.num_parameters)
            ? Number(parsed.num_parameters)
            : undefined,
      })

      // * compare with any existing
      const existing = existingModels.find((m) => m.resourceKey === shape.resourceKey)
      if (existing) {
        if (replace) {
          await ctx.runMutation(internal.db.models.updateChatModel, {
            id: existing._id,
            ...shape,
          })
        }
        if (!existing.available) {
          console.warn(endpoint, 'model now available', shape.name, shape.resourceKey)
        }
      } else {
        await ctx.runMutation(internal.db.models.createChatModel, shape)
        await logActionOpsEvent(ctx, {
          message: `${endpoint} new model: ${shape.name}`,
          type: 'notice',
        })
        console.info(endpoint, 'created new model', shape.name, shape.resourceKey)
      }

      availabilityCheck.delete(shape.resourceKey)
    } catch (err) {
      if (vb.isValiError(err)) {
        console.error(endpoint, vb.flatten(err.issues))
      } else {
        console.error(endpoint, err)
      }
    }
  }
}

export const importChatModels = internalAction({
  args: {
    replace: v.optional(v.boolean()),
  },
  handler: async (ctx: ActionCtx, { replace = false }) => {
    console.info(endpoint, 'importing models')
    console.log('https://api.together.xyz/models/info')
    const response = await ky
      .get('https://api.together.xyz/models/info', {
        headers: {
          Authorization: `Bearer ${ENV.TOGETHER_API_KEY}`,
        },
      })
      .json()
    const records = ApiModelsResponse.parse(response).filter(
      (m) => m.display_type === DisplayType.Chat,
    )
    await processModelRecords(ctx, records, replace)
  },
})

enum DisplayType {
  Chat = 'chat',
  Code = 'code',
  Embedding = 'embedding',
  Image = 'image',
  Language = 'language',
  Moderation = 'moderation',
}

const ApiModelsResponse = z
  .object({
    name: z.string(),
    display_type: z.nativeEnum(DisplayType),
    isFeaturedModel: z.boolean().optional(),
  })
  .passthrough()
  .array()

const configSchema = z.object({
  stop: z.array(z.string()).optional(),
  prompt_format: z.string().optional().nullable(),
  chat_template: z.string().optional().nullable(),
  add_generation_prompt: z.boolean().optional(),
  safety_label: z.string().optional(),
  safe_response: z.boolean().optional(),
  safety_config: z
    .object({
      max_tokens: z.number(),
      temperature: z.number().optional(),
      top_p: z.number().optional(),
      stop: z.array(z.string()).optional(),
    })
    .optional(),
  safety_categories: z.unknown().optional(),
  chat_template_name: z.string().optional().nullable(),
  height: z.number().optional(),
  width: z.number().optional(),
  number_of_images: z.number().optional(),
  steps: z.number().optional(),
  seed: z.number().optional(),
  max_tokens: z.number().optional(),
  pre_prompt: z.string().optional(),
  eos_token: z.string().optional(),
  tools_template: z.string().optional(),
  bos_token: z.string().optional(),
  step_id: z.string().optional(),
  track_qps: z.boolean().optional(),
})

const ApiModelRecord = z.object({
  _id: z.string(),
  name: z.string(),
  display_name: z.string(),
  display_type: z.nativeEnum(DisplayType),
  description: z.string(),
  license: z.string(),
  creator_organization: z.string(),
  num_parameters: z.union([z.number(), z.string()]).optional(),
  show_in_playground: z.union([z.boolean(), z.string()]),
  isFeaturedModel: z.boolean().optional(),
  context_length: z.number().optional(),
  config: configSchema.optional().nullable(),
  pricing: z.object({
    base: z.number().optional(),
    finetune: z.number().optional(),
    hourly: z.number().optional(),
    input: z.number(),
    output: z.number(),
  }),
  created_at: z.string().optional(),
  update_at: z.string().optional(),
  access: z.string().optional(),
  link: z.string().optional(),
  descriptionLink: z.string().optional(),
  pricing_tier: z.string().optional().nullable(),
  release_date: z.string().optional(),
  isPrivate: z.boolean().optional(),
  access_control: z.array(z.any()).optional(),
  finetuning_supported: z.boolean().optional(),
  isDedicatedInstance: z.boolean().optional(),
  isSelfServeDedicatedInstance: z.boolean().optional(),
  isFinetuned: z.boolean().optional(),
  owner_userid: z.string().optional().nullable(),
  external_pricing_url: z.string().optional(),
  engine: z.string().optional(),
  serviceName: z.string().optional(),
  renamed: z.string().optional(),
  max_tokens: z.number().optional(),
})
