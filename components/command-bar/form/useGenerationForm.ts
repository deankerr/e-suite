// import { useMutation } from 'convex/react'
// import { toast } from 'sonner'
// import { z } from 'zod'
// import { zfd } from 'zod-form-data'

// import { useCurrentModelAtom, useGenerationQuantity } from '@/components/command-bar/atoms'
// import { api } from '@/convex/_generated/api'
// import { imageGenerationSizesMap } from '@/convex/constants'

// const formSchema = zfd.formData({
//   prompt: zfd.text(),
//   negative_prompt: zfd.text(z.string().optional()),

//   seed: zfd.numeric(z.number().optional()),
//   scale: zfd.numeric(z.number().optional()),
//   guidance_scale: zfd.numeric(z.number().optional()),
//   steps: zfd.numeric(z.number().optional()),
//   num_inference_steps: zfd.numeric(z.number().optional()),

//   scheduler: zfd.text(z.string().optional()),
//   style: zfd.text(z.string().optional()),

//   lcm: zfd.checkbox().optional(),
//   use_default_neg: zfd.checkbox().optional(),

//   expand_prompt: zfd.checkbox().optional(),
//   enable_safety_checker: zfd.checkbox().optional(),

//   dimensions: zfd.repeatable(z.string().array().min(1)),

//   model_name: zfd.text(z.string().optional()),
//   model_architecture: zfd.text(z.string().optional()),
//   variant: zfd.text(z.string().optional()),
//   _lora_path: zfd.text(z.string().optional()),
//   _lora_scale: zfd.numeric(z.number().optional()),
// })

// export const useGenerationForm = () => {
//   const [currentModel] = useCurrentModelAtom()
//   const [quantity] = useGenerationQuantity()
//   const thread = useThreadCtx()

//   const send = useMutation(api.messages.create)

//   const formAction = (formData: FormData) => {
//     if (!currentModel || !thread) return

//     const form = formSchema.safeParse(formData)
//     if (!form.success) {
//       toast.error('Form validation failed')
//       console.error(form.error.issues)
//       return
//     }

//     toast.success('Form validation success')
//     console.log(form.data)

//     const { dimensions, prompt, ...rest } = form.data

//     const sizes = dimensions.map((value) => {
//       const size = value as keyof typeof imageGenerationSizesMap
//       const { width, height } = imageGenerationSizesMap[size]
//       return { size, width, height }
//     })

//     const parameters = {
//       provider: currentModel.provider,
//       endpoint: '',
//       prompt,
//       n: Number(quantity),

//       model_id: currentModel.model_id,
//       entries: Object.entries(rest).filter(([_, value]) => value !== undefined),
//     }
//     const generations = sizes.map((size) => ({ ...size, ...parameters }))

//     send({
//       message: {
//         role: 'assistant',
//       },
//       threadId: thread._id,
//       generations,
//     })
//       .then(() => toast.success('generation started'))
//       .catch((err) => {
//         toast.error('An error occurred.')
//         console.error(err)
//       })
//   }

//   return { formAction }
// }
