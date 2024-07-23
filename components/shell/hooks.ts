import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import { shellSearchValueAtom, shellStackAtom } from '@/components/shell/atoms'

import type { ShellPage } from '@/components/shell/Shell'

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
