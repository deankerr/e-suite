import { atom, WritableAtom } from 'jotai'

export type ToggleAtom = WritableAtom<boolean, [toValue?: boolean | undefined], void>
export type UiAtomNames = keyof typeof uiAtoms

//* Toggle Atoms
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

const uiAtoms = {
  generationDrawerOpen: createToggleAtom(false),
} as const

export const getUiAtom = (name: keyof typeof uiAtoms) => uiAtoms[name]

const toggleAtoms = new Map<string, ToggleAtom>()

export const getToggleAtom = (name: string, initial = false) => {
  if (name in uiAtoms) return uiAtoms[name as UiAtomNames]

  const exAtom = toggleAtoms.get(name)
  if (exAtom) return exAtom

  const newAtom = createToggleAtom(initial)
  toggleAtoms.set(name, newAtom)
  return newAtom
}
