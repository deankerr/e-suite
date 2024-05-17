import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useInputBarAtom } from '@/components/input-bar/atoms'
import { imageGenerationSizesMap } from '@/convex/constants'
import { useCreateMessage, useCreateThread, useThread } from '@/lib/api'
import { useRouteKeys } from '@/lib/hooks'

import type { InputBarState } from '@/components/input-bar/atoms'

export const useSendMessage = () => {
  const [inputBar] = useInputBarAtom()

  const sendCreateThread = useCreateThread()
  const sendCreateMessage = useCreateMessage()
  const router = useRouter()

  const keys = useRouteKeys()
  const { thread } = useThread(keys)
  const isLoading = false
  const isError = false

  // eslint-disable-next-line @typescript-eslint/require-await
  const sendMessage = async () => {
    try {
      if (isLoading || isError) return
      const slug = thread?.slug ?? (await sendCreateThread({}))
      const inference = getInferenceParameters(inputBar)
      await sendCreateMessage({
        slug,
        message: { role: 'user', content: inputBar.prompt },
        inference,
      })
      router.replace(`/t/${slug}`)
    } catch (err) {
      toast.error('An error occurred')
      console.error(err)
    }
  }

  return sendMessage
}

const getInferenceParameters = (inputBar: InputBarState) => {
  return inputBar.mode === 'chat' ? getChatParameters(inputBar) : getImageParameters(inputBar)
}

const getChatParameters = (inputBar: InputBarState) => {
  return {
    type: 'chat-completion' as const,
    endpoint: inputBar.chatModel.startsWith('gpt-') ? 'openai' : 'together',
    parameters: {
      model: inputBar.chatModel,
    },
  }
}

const getImageParameters = (inputBar: InputBarState) => {
  const provider = inputBar.imageModel.startsWith('fal') ? 'fal' : 'sinkin'
  const size = getImageSize(inputBar.imageShape, provider)
  return {
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
}

const getImageSize = (
  size: string,
  provider: 'fal' | 'sinkin',
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
