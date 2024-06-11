import ky from 'ky'
import { z } from 'zod'

import { internal } from '../_generated/api'

import type { ActionCtx } from '../_generated/server'
import type { ChatModelDataRecord } from '../db/models'
import type { MutationCtx } from '../types'

export const fetchModelData = async (ctx: ActionCtx) => {
  console.log('https://api.together.xyz/models/info')
  const response = await ky
    .get('https://api.together.xyz/models/info', {
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      },
    })
    .json()
  await ctx.runMutation(internal.db.models.cacheEndpointModelData, {
    endpoint: 'together',
    name: 'chat-models',
    data: JSON.stringify(response, null, 2),
  })
}

export const getNormalizedModelData = async (ctx: MutationCtx) => {
  const cached = await ctx
    .table('endpoint_data_cache')
    .order('desc')
    .filter((q) =>
      q.and(q.eq(q.field('endpoint'), 'together'), q.eq(q.field('name'), 'chat-models')),
    )
    .firstX()

  const modelList = modelDataListSchema.parse(JSON.parse(cached.data))
  const chatModelList = modelList.filter(
    (m) => m.display_type === DisplayType.Chat && m.isFeaturedModel,
  )

  const models = chatModelList
    .map((raw): ChatModelDataRecord | null => {
      const parsed = modelDataRecordSchema.safeParse(raw)
      if (!parsed.success) {
        console.error(parsed.error.issues)
        return null
      }

      const d = parsed.data
      return {
        slug: `together::${d.name}`,
        name: d.display_name,
        description: d.description,

        creatorName: d.creator_organization,
        link: d.link,
        license: d.license,
        tags: [],

        numParameters: d.num_parameters ? Number(d.num_parameters) : 0,
        contextLength: d.context_length ?? 0,
        tokenizer: '',
        stop: [],

        endpoint: 'together',
        model: d.name,
        pricing: {},
        moderated: false,
        available: true,
        hidden: false,
      }
    })
    .filter(Boolean) as ChatModelDataRecord[]

  console.log('together: processed', models.length, 'models')
  return models
}

enum DisplayType {
  Chat = 'chat',
  Code = 'code',
  Embedding = 'embedding',
  Image = 'image',
  Language = 'language',
  Moderation = 'moderation',
}

enum PricingTier {
  Empty = '',
  Featured = 'Featured',
  PricingTierFeatured = 'featured',
  PricingTierSupported = 'Supported',
  Supported = 'supported',
}

enum ChatTemplateName {
  Default = 'default',
  GPT = 'gpt',
  Llama = 'llama',
}

enum EOSToken {
  EndOfText = '<|end_of_text|>',
  Endoftext = '<|endoftext|>',
  S = '</s>',
}

enum Access {
  Empty = '',
  Limited = 'limited',
  Open = 'open',
}

const modelDataListSchema = z
  .object({
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
  chat_template_name: z.nativeEnum(ChatTemplateName).optional().nullable(),
  height: z.number().optional(),
  width: z.number().optional(),
  number_of_images: z.number().optional(),
  steps: z.number().optional(),
  seed: z.number().optional(),
  max_tokens: z.number().optional(),
  pre_prompt: z.string().optional(),
  eos_token: z.nativeEnum(EOSToken).optional(),
  tools_template: z.string().optional(),
  bos_token: z.string().optional(),
  step_id: z.string().optional(),
  track_qps: z.boolean().optional(),
})

const modelDataRecordSchema = z.object({
  _id: z.string(),
  name: z.string(),
  display_name: z.string(),
  display_type: z.nativeEnum(DisplayType),
  description: z.string(),
  license: z.string(),
  creator_organization: z.string(),
  hardware_label: z.string(),
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
  access: z.nativeEnum(Access),
  link: z.string(),
  descriptionLink: z.string(),
  pricing_tier: z.nativeEnum(PricingTier).optional().nullable(),
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
