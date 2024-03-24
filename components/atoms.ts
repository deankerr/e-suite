import { atom, useAtom } from 'jotai'

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

const voiceoverAutoplayedListAtom = atom<string[]>([])

export function useVoiceoverAutoplayedListAtom() {
  return useAtom(voiceoverAutoplayedListAtom)
}

export const navbarOpenAtom = atom(false)
