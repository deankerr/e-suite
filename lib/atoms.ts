import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithPending } from 'jotai-suspense'
import { atomFamily } from 'jotai/utils'

import type { api } from '@/convex/_generated/api'
import type { MessageContent, Thread } from '@/convex/external'
import type { UsePaginatedQueryReturnType } from 'convex/react'
