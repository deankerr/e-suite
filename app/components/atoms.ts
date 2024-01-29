import { atom, WritableAtom } from 'jotai'

export type ToggleAtom = WritableAtom<boolean, [toValue?: boolean | undefined], void>
export type UiAtomNames = keyof typeof uiAtoms

const createToggleAtom = (initialValue: boolean) => {
  const valueAtom = atom(initialValue)
  const rwAtom = atom(
    (get) => get(valueAtom),
    (get, set, toValue?: boolean) => {
      set(valueAtom, toValue ?? !get(valueAtom))
    },
  )
  return rwAtom
}

const cra = createToggleAtom

const uiAtoms = {
  generationsPanelOpen: cra(true),
  userPanelOpen: cra(true),
} as const

export const getUiAtom = (name: keyof typeof uiAtoms) => uiAtoms[name]
