import { atom, useAtom } from 'jotai'
import { atomWithStorage, RESET } from 'jotai/utils'

import { GenerationPanel } from '@/components/command-bar/panels/GenerationPanel'
import { ModelBrowserPanel } from '@/components/command-bar/panels/ModelBrowserPanel'

import type { ModelContent } from '@/convex/external'
import type { ButtonProps } from '@radix-ui/themes'

type Panel = {
  id: string
  name: string
  button: ButtonProps
  component: () => React.ReactNode
  hidden: boolean
}

export const panels: Panel[] = [
  {
    id: 'models',
    name: 'Models',
    button: { color: 'amber' },
    component: ModelBrowserPanel,
    hidden: false,
  },
  {
    id: 'generation',
    name: 'Generate',
    button: { color: 'orange' },
    component: GenerationPanel,
    hidden: false,
  },
]

const commandBarAtom = atomWithStorage('command-bar', {
  containerHeight: 850,
  containerWidth: 768,
  isHidden: true,
  isOpen: false,
  layout: {
    railInnerHeight: 56,
    panelInnerHeight: 512,
  },
  panelIndex: 0,
})
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
