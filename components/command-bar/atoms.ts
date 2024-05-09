import { atom, useAtom } from 'jotai'
import { atomWithStorage, RESET } from 'jotai/utils'

import type { ModelContent } from '@/convex/external'

const commandBarAtom = atomWithStorage('command-bar', {
  containerHeight: 850,
  isHidden: false,
  isOpen: true,
})
commandBarAtom.debugLabel = 'commandBar'
export const useCommandBar = () => {
  const [values, set] = useAtom(commandBarAtom)
  const reset = () => set(RESET)
  return { ...values, set, reset }
}

// generation
const currentModelAtom = atomWithStorage<ModelContent | undefined>('current-model', undefined)
export const useCurrentModelAtom = () => useAtom(currentModelAtom)

const quantityAtom = atom('2')
export const useGenerationQuantity = () => useAtom(quantityAtom)
