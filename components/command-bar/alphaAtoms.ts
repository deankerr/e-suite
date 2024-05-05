import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import type { ModelContent } from '@/convex/external'

export const cmbrLayoutAtom = atomWithStorage('cmbr-layout', {
  containerHeightPc: 85,
  panelHeight: 512,
  panelOpen: true,
  rounded: false,
})
cmbrLayoutAtom.debugLabel = 'cmbr-layout'

export const useCmbrLayoutAtom = () => {
  return useAtom(cmbrLayoutAtom)
}

const cmbrPanelsAtom = atomWithStorage('cmbr-panels', { index: 0 })
cmbrPanelsAtom.debugLabel = 'cmbr-panels'
export const useCmbrPanelsAtom = () => {
  return useAtom(cmbrPanelsAtom)
}

// generation
const currentModelAtom = atomWithStorage<ModelContent | undefined>('current-model', undefined)
export const useCurrentModelAtom = () => useAtom(currentModelAtom)
