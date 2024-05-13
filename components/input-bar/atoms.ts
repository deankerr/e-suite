import { atom, useAtom } from 'jotai'

type InputBarData = {
  mode: 'chat' | 'image'
  chatModel: string
  imageModel: string
  prompt: string
}

const inputBarAtom = atom<InputBarData>({
  mode: 'chat',
  chatModel: 'Austism/chronos-hermes-13b',
  imageModel: 'fal-ai/hyper-sdxl',
  prompt: '',
})

export const useInputBarAtom = () => useAtom(inputBarAtom)
