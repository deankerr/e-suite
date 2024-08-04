import { atom } from 'jotai'

import type { MessageQueryFilters } from '@/components/providers/MessagesQueryProvider'

export const messageQueryAtom = atom<MessageQueryFilters>({})
