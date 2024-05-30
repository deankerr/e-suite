// import { maxInputStringLength } from '../constants'
// const transforms = {
//   trimTo: (v: string, max?: number) => v.slice(0, max ?? maxInputStringLength).trim(),
// }

const inputRegister = {
  textarea: 'textarea',
  text: 'text',
  number: 'number',
  select: 'select',
  checkbox: 'checkbox',
  constant: 'constant',
  ignore: 'ignore',
} as const

export type ParameterFormInput = {
  name: string
  label?: string
  required?: boolean
  element: keyof typeof inputRegister
  number?: {
    min: number
    max: number
    step?: number
  }
  items?: string[]
  value?: string | number | boolean
  initial?: string | number | boolean
  placeholder?: string
}

const sinkin = {
  '*': [
    {
      name: 'prompt',
      required: true,
      element: 'textarea',
    },
    {
      name: 'negative_prompt',
      element: 'textarea',
    },
    { name: 'seed', element: 'number', number: { min: -1, max: 999999999, step: 1 } },
    {
      name: 'scale',
      element: 'number',
      number: { min: 1, max: 20, step: 0.1 },
      placeholder: '7.5',
    },
    { name: 'steps', element: 'number', number: { min: 1, max: 50, step: 1 }, placeholder: '30' },
    {
      name: 'scheduler',
      element: 'select',
      items: ['DPMSolverMultistep', 'K_EULER_ANCESTRAL', 'DDIM', 'K_EULER', 'PNDM', 'KLMS'],
    },
    { name: 'lcm', element: 'checkbox', initial: false },
    { name: 'use_default_neg', element: 'checkbox', initial: true },

    { name: 'model_id', element: 'ignore' },
    { name: 'width', element: 'ignore' },
    { name: 'height', element: 'ignore' },
    { name: 'num_images', element: 'ignore' },
    { name: 'lora', element: 'ignore' },
    { name: 'lora_scale', element: 'ignore' },
    { name: 'version', element: 'ignore' },
  ],
} satisfies Record<string, ParameterFormInput[]>

const fal = {
  'fal-ai/hyper-sdxl': [
    {
      name: 'prompt',
      required: true,
      element: 'textarea',
    },
    { name: 'seed', element: 'number', number: { min: -1, max: 999999999, step: 1 } },
    { name: 'steps', element: 'select', items: ['1', '2', '4'] },
    { name: 'expand_prompt', element: 'checkbox', initial: true },
    { name: 'enable_safety_checker', element: 'checkbox', initial: false },

    { name: 'format', element: 'ignore' },
    { name: 'model_id', element: 'ignore' },
    { name: 'image_size', element: 'ignore' },
    { name: 'num_images', element: 'ignore' },
    { name: 'embeddings', element: 'ignore' },
    { name: 'sync_mode', element: 'ignore' },
  ],

  'fal-ai/fast-lightning-sdxl': [
    {
      name: 'prompt',
      required: true,
      element: 'textarea',
    },
    { name: 'seed', element: 'number', number: { min: -1, max: 999999999, step: 1 } },
    { name: 'steps', element: 'select', items: ['1', '2', '4', '8'] },
    { name: 'expand_prompt', element: 'checkbox', initial: true },
    { name: 'enable_safety_checker', element: 'checkbox', initial: false },

    { name: 'format', element: 'ignore' },
    { name: 'model_id', element: 'ignore' },
    { name: 'image_size', element: 'ignore' },
    { name: 'num_images', element: 'ignore' },
    { name: 'embeddings', element: 'ignore' },
    { name: 'sync_mode', element: 'ignore' },
  ],

  'fal-ai/pixart-sigma': [
    {
      name: 'prompt',
      required: true,
      element: 'textarea',
    },
    { name: 'seed', element: 'number', number: { min: -1, max: 999999999, step: 1 } },
    {
      name: 'guidance_scale',
      element: 'number',
      number: { min: 1, max: 10, step: 0.1 },
    },
    {
      name: 'style',
      element: 'select',
      items: [
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
      ],
    },
    { name: 'scheduler', element: 'select', items: ['DPM-SOLVER', 'SA-SOLVER'] },

    { name: 'expand_prompt', element: 'checkbox', initial: true },
    { name: 'enable_safety_checker', element: 'checkbox', initial: false },

    { name: 'format', element: 'ignore' },
    { name: 'model_id', element: 'ignore' },
    { name: 'image_size', element: 'ignore' },
    { name: 'num_images', element: 'ignore' },
    { name: 'embeddings', element: 'ignore' },
    { name: 'sync_mode', element: 'ignore' },
  ],

  'fal-ai/lora': [
    {
      name: 'prompt',
      required: true,
      element: 'textarea',
    },
    {
      name: 'negative_prompt',
      element: 'textarea',
    },

    { name: 'seed', element: 'number', number: { min: -1, max: 999999999, step: 1 } },
    {
      name: 'guidance_scale',
      element: 'number',
      number: {
        min: 1,
        max: 10,
        step: 0.1,
      },
    },
    {
      name: 'num_inference_steps',
      element: 'number',
      number: { min: 1, max: 99 },
    },
    {
      name: 'scheduler',
      element: 'select',
      items: [
        'DPM++ 2M',
        'DPM++ 2M Karras',
        'DPM++ 2M SDE',
        'DPM++ 2M SDE Karras',
        'Euler',
        'Euler A',
        'LCM',
      ],
    },

    { name: 'expand_prompt', element: 'checkbox', initial: true },
    { name: 'enable_safety_checker', element: 'checkbox', initial: false },

    { name: 'loras', element: 'ignore' },
    { name: 'model_name', element: 'ignore' },
    { name: 'model_architecture', element: 'ignore' },

    { name: 'format', element: 'ignore' },
    { name: 'model_id', element: 'ignore' },
    { name: 'image_size', element: 'ignore' },
    { name: 'num_images', element: 'ignore' },
    { name: 'embeddings', element: 'ignore' },
    { name: 'sync_mode', element: 'ignore' },
  ],
} satisfies Record<string, ParameterFormInput[]>

export const paramBodySchemas: Record<'fal' | 'sinkin', Record<string, ParameterFormInput[]>> = {
  sinkin,
  fal,
}
