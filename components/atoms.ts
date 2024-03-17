import { atom, useAtom, WritableAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export function createTextInputAtom(args: { label: string; name: string; initialValue: string }) {
  return { ...args, atom: atom(args.initialValue) }
}

export function createNumberInputAtom(args: {
  label: string
  name: string
  initialValue: number
  min: number
  max: number
  step: number
}) {
  return { ...args, atom: atom(args.initialValue) }
}

const chatListOpenAtom = atom(false)

export function useChatListOpenAtom() {
  const [isOpen, setIsOpen] = useAtom(chatListOpenAtom)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  return { isOpen, setIsOpen, open, close, toggle }
}

const voiceoverAutoplayedListAtom = atom<string[]>([])

export function useVoiceoverAutoplayedListAtom() {
  return useAtom(voiceoverAutoplayedListAtom)
}

export function atomWithToggleAndStorage(
  key: string,
  initialValue?: boolean,
  storage?: any,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atomWithStorage(key, initialValue, storage)
  const derivedAtom = atom(
    (get) => get(anAtom),
    (get, set, nextValue?: boolean) => {
      const update = nextValue ?? !get(anAtom)
      void set(anAtom, update)
    },
  )
  return derivedAtom as WritableAtom<boolean, [boolean?], void>
}

export const navOpenAtom = atomWithToggleAndStorage('navOpen', true)
