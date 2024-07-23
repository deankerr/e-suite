import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import {
  shellSearchValueAtom,
  shellSelectedThreadIdAtom,
  shellStackAtom,
} from '@/components/shell/atoms'
import { useUserThreadsList } from '@/lib/queries'

import type { ShellPage } from '@/components/shell/Shell'
import type { EThread } from '@/convex/types'

export const useIsCurrentPage = (page: ShellPage) => {
  const stack = useAtomValue(shellStackAtom)
  return stack.at(-1) === page
}

export const useShellStack = () => {
  const [stack, setStack] = useAtom(shellStackAtom)
  const setSearchValue = useSetAtom(shellSearchValueAtom)

  const current = stack.at(-1)

  const push = (page: ShellPage) => {
    setStack([...stack, page])
    setSearchValue('')
  }

  const pop = () => {
    setStack(stack.slice(0, -1))
  }

  const set = (page: ShellPage) => {
    setStack([page])
    setSearchValue('')
  }

  const clear = () => {
    setStack([])
    setSearchValue('')
  }

  return { stack, push, pop, set, clear, current }
}

export const useShellUserThreads = () => {
  const list = useUserThreadsList()
  const [selectedThreadId, setSelectedThreadId] = useAtom(shellSelectedThreadIdAtom)

  const current = list ? (list.find((t) => t._id === selectedThreadId) ?? null) : undefined

  const select = (thread: EThread) => {
    setSelectedThreadId(thread._id)
  }

  return { list, select, current }
}
