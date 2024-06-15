import { useAtom } from 'jotai'
import { nanoid } from 'nanoid/non-secure'

import { chatDeckAtom } from '@/lib/atoms'

const createLocalChatSlug = () => `_${nanoid(5)}`

const removeLocalChatData = (slug: string) => {
  try {
    localStorage.removeItem(`chat-${slug}`)
  } catch (err) {
    console.error(err)
  }
}

export const useChatDeck = () => {
  const [deck, setDeck] = useAtom(chatDeckAtom)

  const add = (slug?: string) => {
    setDeck((deck) => [slug ?? createLocalChatSlug(), ...deck])
  }

  const remove = (slug: string) => {
    setDeck((deck) => deck.filter((s) => s !== slug))
    removeLocalChatData(slug)
  }

  return { deck, setDeck, add, remove }
}
