import { useState } from 'react'
import { atom } from 'jotai'
import { useImmerAtom } from 'jotai-immer'
import { focusAtom } from 'jotai-optics'
import { atomWithStorage } from 'jotai/utils'

export const commandMenuOpenAtom = atom(false)

export const chatDeckAtom = atomWithStorage<string[]>('chat-deck', [])

export const voiceoverQueueAtom = atom<string[]>([])
export const voiceoverAutoplayThreadIdAtom = atom('')

type ChatState = {
  sidebarOpen: boolean
  queryFilters?: {
    role: 'any' | 'user' | 'ai'
    image: boolean
    audio: boolean
  }
}

const defaultState: ChatState = {
  sidebarOpen: false,
}

export const chatStateAtom = atomWithStorage<Record<string, ChatState>>('chat-state', {})

export const useChatState = (id: string) => {
  const [chatStateFocusAtom] = useState(() => {
    const a = focusAtom(chatStateAtom, (optic) => optic.prop(id))
    a.onMount = (set) => {
      set((state) => {
        return state ?? defaultState
      })
    }
    return a
  })

  const [get, set] = useImmerAtom(chatStateFocusAtom)
  return [get ?? defaultState, set] as const
}
