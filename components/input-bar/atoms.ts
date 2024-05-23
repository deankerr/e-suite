import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type InputBarState = {
  mode: 'chat' | 'image'
  prompt: string
  chatModel: string
  chatStream: boolean
  imageModel: string
  imageShape: 'portrait' | 'square' | 'landscape'
}

const inputBarAtom = atomWithStorage<InputBarState>('e-input-bar-0', {
  mode: 'image',
  prompt: '',
  chatModel: 'meta-llama/Llama-3-70b-chat-hf',
  chatStream: true,
  imageModel: 'fal-ai/hyper-sdxl',
  imageShape: 'square',
})

export const useInputBarAtom = () => useAtom(inputBarAtom)
