import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { useCurrentModelAtom, useGenerationQuantity } from '@/components/command-bar/alphaAtoms'
import { api } from '@/convex/_generated/api'
import { imageSizesPx } from '@/convex/constants'
import { generationInferenceParamsSchema } from '@/convex/schema'
import { useThreadCtx } from '@/lib/queries'

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

    const { dimensions, ...parameters } = form.data
    //TODO temp: remove unsupported params
    const generation = generationInferenceParamsSchema.parse({
      parameters: {
        ...parameters,
        provider: currentModel.provider,
        model_id: currentModel.model_id,
      },
      dimensions: getDimensionsN(dimensions, Number(quantity)),
    })

    send({
      message: {
        role: 'assistant',
        inference: {
          generation,
        },
      },
      threadId: thread._id,
    })
      .then(() => toast.success('generation started'))
      .catch((err) => {
        toast.error('An error occurred.')
        console.error(err)
      })
  }

  return { formAction }
}

const getDimensionsN = (sizes: string[], n: number) => {
  const sizesToPx = imageSizesPx as Record<string, { width: number; height: number }>
  return sizes
    .map((size) => {
      const px = sizesToPx[size]
      if (px) return { ...px, n }
    })
    .filter(Boolean) as {
    n: number
    width: number
    height: number
  }[]
}
