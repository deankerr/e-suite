import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type InputBarState = {
  mode: 'chat' | 'image'
  prompt: string
  chatModel: string
  chatStream: boolean
  imageModel: string
  imageShape: 'portrait' | 'square' | 'landscape'
  imageN: string
}

const inputBarAtom = atomWithStorage<InputBarState>('e-input-bar-0', {
  mode: 'image',
  prompt: '',
  chatModel: 'meta-llama/Llama-3-70b-chat-hf',
  chatStream: true,
  imageModel: 'fal-ai/hyper-sdxl',
  imageShape: 'square',
  imageN: String(4),
})

export const useInputBarAtom = () => useAtom(inputBarAtom)
