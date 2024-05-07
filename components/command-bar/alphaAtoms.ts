import { useAtom } from 'jotai'
import { atomWithStorage, RESET } from 'jotai/utils'

import type { ModelContent } from '@/convex/external'

const cmbrDefaults = {
  containerHeightPc: 85,
  panelHeight: 512,
  panelIndex: 0,
  isOpen: false,
  isVisible: true,
}

const cmbrAtom = atomWithStorage('cmbr', cmbrDefaults)
cmbrAtom.debugLabel = 'cmbr'
export const useCmbr = () => {
  const [values, set] = useAtom(cmbrAtom)
  const reset = () => set(RESET)
  return { values, set, reset }
}

// generation
const currentModelAtom = atomWithStorage<ModelContent | undefined>('current-model', undefined)
export const useCurrentModelAtom = () => useAtom(currentModelAtom)
