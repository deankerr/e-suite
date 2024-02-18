import { atom, useAtom } from 'jotai'
import { createContext, useContext } from 'react'

//* Shell

export const sidebarConfigWidths = [256, 288, 320, 384] as const

export const defaultShellAtom = {
  leftOpen: false,
  rightOpen: true,
}

type ShellAtomConfig = typeof defaultShellAtom & {
  leftWidth: (typeof sidebarConfigWidths)[number]
  rightWidth: (typeof sidebarConfigWidths)[number]
}

export const createShellContextAtom = (initial?: Partial<ShellAtomConfig>) => {
  const valueAtom = atom({ ...defaultShellAtom, ...initial })

  const interfaceAtom = atom(
    (get) => get(valueAtom),
    (get, set, values: Partial<ShellAtomConfig>) => {
      set(valueAtom, { ...get(valueAtom), ...values })
    },
  )
  return interfaceAtom
}

export const ShellContext = createContext<ReturnType<typeof createShellContextAtom> | null>(null)

export const useShellContext = () => {
  const context = useContext(ShellContext)
  if (!context) throw new Error('useShellContext called outside of provider')
  return useAtom(context)
}
