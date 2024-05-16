import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type InputBarData = {
  mode: 'chat' | 'image'
  prompt: string
  chatModel: string
  imageModel: string
  imageShape: 'portrait' | 'square' | 'landscape'
}

const inputBarAtom = atomWithStorage<InputBarData>('e-input-bar-0', {
  mode: 'image',
  prompt: '',
  chatModel: 'meta-llama/Llama-3-70b-chat-hf',
  imageModel: 'fal-ai/hyper-sdxl',
  imageShape: 'square',
})

export const useInputBarAtom = () => useAtom(inputBarAtom)
