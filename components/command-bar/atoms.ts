import { useCallback } from 'react'
import { atom, useAtom } from 'jotai'
import { atomFamily, useAtomCallback } from 'jotai/utils'

import { GenerationInputPanel } from '@/components/command-bar/GenerationInputPanel'
import { HomePanel } from '@/components/command-bar/HomePanel'
import { ModelBrowserPanel } from '@/components/command-bar/ModelBrowserCard'

import type { ModelContent } from '@/convex/external'
import type { ButtonProps } from '@radix-ui/themes'

type Panel = {
  panelId: string
  name: string
  buttonProps: ButtonProps
  el: typeof HomePanel
  ref?: HTMLDivElement
}

const defPanels: Panel[] = [
  { panelId: 'home', name: 'Home', buttonProps: { color: 'crimson' }, el: HomePanel },
  { panelId: 'gen1', name: 'Gen1', buttonProps: { color: 'brown' }, el: GenerationInputPanel },
  { panelId: 'models', name: 'Models', buttonProps: { color: 'mint' }, el: ModelBrowserPanel },
]

const panelsAtom = atom<Panel[]>(defPanels)

export const usePanelsAtom = () => {
  const p = useAtom(panelsAtom)

  return p
}

//* Generation
type Resource = ModelContent

const formResourceAtom = atom<Resource | undefined>(undefined)
export const useFormResource = () => {
  const [value, set] = useAtom(formResourceAtom)

  return {
    ...value,
    set,
  }
}

type FormInputValue = { name: string; value: string | string[] | number | boolean }
export const formInputAtomFamily = atomFamily(
  (input: FormInputValue) => atom(input),
  (a, b) => a.name === b.name,
)

export const useFormAtom = <T extends FormInputValue['value']>(name: string, value: T) => {
  const [input, setInput] = useAtom(formInputAtomFamily({ name, value }))
  return {
    set: (value: T) => setInput({ name, value }),
    value: input.value as T,
  }
}

export const useReadForm = (keys: string[]) => {
  const readForm = useAtomCallback(
    useCallback(
      (get) => {
        const values = keys.map((key) => {
          const input = get(formInputAtomFamily({ name: key, value: '' }))
          return input
        })

        return values
      },
      [keys],
    ),
  )

  return readForm
}
