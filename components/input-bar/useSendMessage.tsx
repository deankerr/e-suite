import { toast } from 'sonner'

import { useInputBarAtom } from '@/components/input-bar/atoms'
import { imageGenerationSizesMap } from '@/convex/constants'
import { useActiveThread, useCreateMessage } from '@/lib/api'

import type { GenerationProvider } from '@/convex/types'

export const useSendMessage = () => {
  const [inputBar] = useInputBarAtom()
  const thread = useActiveThread()

  const threadId = thread?._id
  const create = useCreateMessage()

  const sendMessage = async () => {
    if (!threadId) return
    const provider = inputBar.imageModel.startsWith('fal') ? 'fal' : 'sinkin'
    const size = getImageSize(inputBar.imageShape, provider)

    const inference =
      inputBar.mode === 'chat'
        ? {
            type: 'chat-completion' as const,
            endpoint: 'together',
            parameters: {
              model: inputBar.chatModel,
            },
          }
        : {
            type: 'text-to-image' as const,
            endpoint: provider,
            parameters: {
              prompt: inputBar.prompt,
              ...size,
              n: 4,
              model_id: inputBar.imageModel,
              entries: [],
            },
          }
    try {
      await create({
        threadId: threadId,
        message: {
          role: 'user',
          content: inputBar.prompt,
        },
        inference,
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
