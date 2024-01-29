import { atom, WritableAtom } from 'jotai'

export const navUserPanelOpenAtom = atom(true)
export const navGenerationPanelOpenAtom = atom(true)

export const forceSignedOutUiAtom = atom(false)

export const toggleAtoms = new Map<
  string,
  WritableAtom<boolean, [toValue?: boolean | undefined], void>
>()

export const createToggleAtom = ({
  name,
  initialValue,
}: {
  name: string
  initialValue: boolean
}) => {
  const existing = toggleAtoms.get(name)
  if (existing) return existing

  const valueAtom = atom(initialValue)
  const rwAtom = atom(
    (get) => get(valueAtom),
    (get, set, toValue?: boolean) => {
      set(valueAtom, toValue ?? !get(valueAtom))
    },
  )

  toggleAtoms.set(name, rwAtom)
  return rwAtom
}

export const getToggleAtom = ({ name }: { name: string }) => {
  const atom = toggleAtoms.get(name)
  if (!atom) throw new Error(`toggleAtom name does not exist: ${name}`)
  return atom
}
