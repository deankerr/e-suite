import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { useCurrentModelAtom, useGenerationQuantity } from '@/components/command-bar/atoms'
import { api } from '@/convex/_generated/api'
import { imageGenerationSizesMap } from '@/convex/constants'
import { useThreadCtx } from '@/lib/queries'

import type { GenerationParameters } from '@/convex/schema'

const formSchema = zfd.formData({
  prompt: zfd.text(),
  negative_prompt: zfd.text(z.string().optional()),

  seed: zfd.numeric(z.number().optional()),
  scale: zfd.numeric(z.number().optional()),
  guidance_scale: zfd.numeric(z.number().optional()),
  steps: zfd.numeric(z.number().optional()),
  num_inference_steps: zfd.numeric(z.number().optional()),

  scheduler: zfd.text(z.string().optional()),
  style: zfd.text(z.string().optional()),

  lcm: zfd.checkbox().optional(),
  use_default_neg: zfd.checkbox().optional(),

  expand_prompt: zfd.checkbox().optional(),
  enable_safety_checker: zfd.checkbox().optional(),

  dimensions: zfd.repeatable(z.string().array().min(1)),

  model_name: zfd.text(z.string().optional()),
  model_architecture: zfd.text(z.string().optional()),
  variant: zfd.text(z.string().optional()),
  _lora_path: zfd.text(z.string().optional()),
  _lora_scale: zfd.numeric(z.number().optional()),
})

export const useGenerationForm = () => {
  const [currentModel] = useCurrentModelAtom()
  const [quantity] = useGenerationQuantity()
  const thread = useThreadCtx()

  const send = useMutation(api.messages.create)

  // eslint-disable-next-line @typescript-eslint/require-await
  const formAction = (formData: FormData) => {
    if (!currentModel || !thread) return

    const form = formSchema.safeParse(formData)
    if (!form.success) {
      toast.error('Form validation failed')
      console.error(form.error.issues)
      return
    }

    toast.success('Form validation success')
    console.log(form.data)

    const { dimensions, prompt, ...rest } = form.data
    // todo sizes
    const { width, height } = imageGenerationSizesMap['square']
    const generation: GenerationParameters = {
      prompt,

      provider: currentModel.provider,
      endpoint: '',
      model_id: currentModel.model_id,
      entries: Object.entries(rest).filter(([_, value]) => value !== undefined),

      width,
      height,
      size: 'square',
      n: 2,
    }

    send({
      message: {
        role: 'assistant',
      },
      threadId: thread._id,
      generations: [generation],
    })
      .then(() => toast.success('generation started'))
      .catch((err) => {
        toast.error('An error occurred.')
        console.error(err)
      })
  }

  return { formAction }
}
