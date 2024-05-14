import { atom, useAtom } from 'jotai'

type InputBarData = {
  mode: 'chat' | 'image'
  prompt: string
  chatModel: string
  imageModel: string
  imageShape: 'portrait' | 'square' | 'landscape'
}

const inputBarAtom = atom<InputBarData>({
  mode: 'image',
  prompt: '',
  chatModel: 'Austism/chronos-hermes-13b',
  imageModel: 'fal-ai/hyper-sdxl',
  imageShape: 'square',
})

export const useInputBarAtom = () => useAtom(inputBarAtom)
