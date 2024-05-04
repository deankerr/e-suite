import { z } from 'zod'

const constants = {
  string: {
    max: 32767,
  },
  steps: {
    max: 50,
  },
  size: {
    min: 128,
    max: 2048,
  },
}

const pipe = {
  trimTo: (v: string, max?: number) => v.slice(0, max ?? constants.string.max).trim(),
}
const zPrompt = (max?: number) => z.string().transform((v) => pipe.trimTo(v, max))
const zIntBetween = (min: number, max: number) => z.number().int().min(min).max(max)
const zSteps = (max?: number) =>
  z
    .number()
    .int()
    .min(1)
    .max(max ?? constants.steps.max)
const zSeed = () => zIntBetween(-1, 999999999)
const zSize = (max?: number) =>
  z
    .number()
    .int()
    .min(constants.size.min)
    .max(max ?? constants.size.max)
    .multipleOf(8)

export const simpleSchema = {
  prompt: zPrompt(),
  negative_prompt: zPrompt().optional(),
  seed: zSeed().optional(),
  steps: zSteps().optional(),
  scheduler: z.enum(['DPMSolverMultistep', 'K_EULER_ANCESTRAL', 'DDIM', 'K_EULER', 'PNDM', 'KLMS']),
}

const sinkinLocalSchema = {
  textToImage: z.object({
    model_id: z.string(),
    width: zSize(896),
    height: zSize(896),
    num_images: zIntBetween(1, 8).optional(),

    prompt: zPrompt(),
    negative_prompt: zPrompt().optional(),

    scheduler: z
      .enum(['DPMSolverMultistep', 'K_EULER_ANCESTRAL', 'DDIM', 'K_EULER', 'PNDM', 'KLMS'])
      .optional(),
    seed: zSeed().optional(),
    steps: zSteps().optional(),
    scale: zIntBetween(1, 20),

    lcm: z.boolean().optional(),
    use_default_neg: z.boolean().optional(),
    version: z.string().optional(), //? per model

    lora: z.string().optional(), //? sinkin loras
    lora_scale: z.number().min(0).max(1),
  }),
} as const

const falTemplate = {
  textToImage: {
    prompt: zPrompt(),
    width: zSize(14142),
    height: zSize(14142),
    num_images: z.number().min(1).max(8).optional(),

    seed: zSeed(),

    enable_safety_checker: z.boolean().optional(),
    format: z.enum(['jpeg', 'png']).optional(),
  },

  loras: z
    .array(
      z.object({
        path: z.string(),
        scale: z.number().min(0).max(1).optional(),
      }),
    )
    .optional(),

  embeddings: z
    .array(
      z.object({
        tokens: z.array(z.string()).optional(),
        path: z.string(),
      }),
    )
    .optional(),
}

const falLocalSchema = {
  'fal-ai/hyper-sdxl': z.object({
    model_id: z.string(),
    ...falTemplate.textToImage,
    embeddings: falTemplate.embeddings,

    steps: z.enum(['1', '2', '4']).optional(),

    expand_prompt: z.boolean().optional(),
    sync_mode: z.boolean().optional(),
  }),

  'fal-ai/fast-lightning-sdxl': z.object({
    model_id: z.string(),
    ...falTemplate.textToImage,

    num_inference_steps: z.enum(['1', '2', '4', '8']).optional(),

    expand_prompt: z.boolean().optional(),
    sync_mode: z.boolean().optional(),
  }),

  'fal-ai/pixart-sigma': z.object({
    model_id: z.string(),
    ...falTemplate.textToImage,

    guidance_scale: zIntBetween(1, 10),
    scheduler: z.enum(['DPM-SOLVER', 'SA-SOLVER']).optional(),

    expand_prompt: z.boolean().optional(),
    sync_mode: z.boolean().optional(),

    style: z
      .enum([
        '(No style)',
        'Cinematic',
        'Photographic',
        'Anime',
        'Manga',
        'Digital Art',
        'Pixel art',
        'Fantasy art',
        'Neonpunk',
        '3D Model',
      ])
      .optional(),
  }),

  'fal-ai/lora': z.object({
    model_id: z.string(),
    ...falTemplate.textToImage,
    embeddings: falTemplate.embeddings,
    loras: falTemplate.loras,

    negative_prompt: zPrompt(),

    guidance_scale: zIntBetween(1, 20),
    num_inference_steps: zIntBetween(1, 75), // actual max 150
    scheduler: z
      .enum([
        'DPM++ 2M',
        'DPM++ 2M Karras',
        'DPM++ 2M SDE',
        'DPM++ 2M SDE Karras',
        'Euler',
        'Euler A',
        'LCM',
      ])
      .optional(),

    model_name: z.string(),
    model_architecture: z.enum(['sd', 'sdxl']).optional(),
  }),
} as const

export const localSchema = {
  fal: falLocalSchema,
  sinkin: sinkinLocalSchema,
} as const
