import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { useInputBarAtom } from '@/components/input-bar/atoms'
import { api } from '@/convex/_generated/api'
import { imageGenerationSizesMap } from '@/convex/constants'
import { useActiveThread } from '@/lib/api'

import type { GenerationProvider } from '@/convex/types'

export const useSendMessage = () => {
  const [inputBar] = useInputBarAtom()
  const thread = useActiveThread()

  const threadId = thread?._id
  const send = useMutation(api.messages.create)

  const sendMessage = async () => {
    if (!threadId) return
    const provider = inputBar.imageModel.startsWith('fal') ? 'fal' : 'sinkin'
    const size = getImageSize(inputBar.imageShape, provider)
    try {
      await send({
        threadId: threadId,
        message: {
          role: 'user',
          text: inputBar.prompt,
        },
        completions:
          inputBar.mode === 'chat'
            ? [
                {
                  model: inputBar.chatModel,
                },
              ]
            : undefined,
        generations:
          inputBar.mode === 'image'
            ? [
                {
                  model_id: inputBar.imageModel,
                  prompt: inputBar.prompt,
                  provider: provider,
                  endpoint: '',
                  ...size,
                  n: 4,
                  entries: [],
                },
              ]
            : undefined,
      })

      toast.success('Message sent.')
    } catch (err) {
      console.error(err)
      toast.error('An error occurred')
    }
  }
  return sendMessage
}

const getImageSize = (
  size: string,
  provider: GenerationProvider,
): { size: keyof typeof imageGenerationSizesMap; width: number; height: number } => {
  switch (size) {
    case 'portrait':
      return provider === 'fal'
        ? { size: 'portrait_16_9', ...imageGenerationSizesMap['portrait_16_9'] }
        : { size: 'portrait_4_3', ...imageGenerationSizesMap['portrait_4_3'] }

    case 'landscape':
      return provider === 'fal'
        ? { size: 'landscape_16_9', ...imageGenerationSizesMap['landscape_16_9'] }
        : { size: 'landscape_4_3', ...imageGenerationSizesMap['landscape_4_3'] }

    case 'square':
    default:
      return provider === 'fal'
        ? { size: 'square_hd', ...imageGenerationSizesMap['square_hd'] }
        : { size: 'square', ...imageGenerationSizesMap['square'] }
  }
}
