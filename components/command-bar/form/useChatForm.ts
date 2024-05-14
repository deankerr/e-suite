// import { useMutation } from 'convex/react'
// import { toast } from 'sonner'
// import { z } from 'zod'
// import { zfd } from 'zod-form-data'

// import { api } from '@/convex/_generated/api'
// import { useThreadCtx } from '@/lib/api'

// const formSchema = zfd.formData({
//   message: zfd.text(),
//   role: zfd.text(z.enum(['user', 'assistant', 'system'])),
//   name: zfd.text(z.string().optional()),
// })

// export const useChatForm = () => {
//   const thread = useThreadCtx()
//   const send = useMutation(api.messages.create)

//   const formAction = (formData: FormData) => {
//     if (!thread) return

//     const form = formSchema.safeParse(formData)
//     if (!form.success) {
//       toast.error('Form validation failed')
//       console.error(form.error.issues)
//       return
//     }

//     const { message, role, name } = form.data
//     send({
//       message: {
//         role,
//         name: role === 'user' ? name : undefined,
//         text: message,
//       },
//       threadId: thread._id,
//     })
//       .then(() => toast.success('message sent'))
//       .catch((err) => {
//         toast.error('An error occurred.')
//         console.error(err)
//       })
//   }

//   return { formAction }
// }
