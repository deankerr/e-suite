'use client'

import { useAtom } from 'jotai'

import { ThreadInterface } from '@/components/thread/ThreadInterface'
import { threadDeckSplitAtom } from '@/lib/atoms'
import { cn } from '@/lib/utils'

type ThreadsPageProps = {
  props?: unknown
} & React.ComponentProps<'div'>

export const ThreadsPage = ({ className, ...props }: ThreadsPageProps) => {
  const [deckAtoms, dispatch] = useAtom(threadDeckSplitAtom)
  return (
    <div
      {...props}
      className={cn(
        'flex h-[calc(100svh-2.75rem)] max-h-full overflow-x-auto overflow-y-hidden',
        className,
      )}
    >
      {deckAtoms.map((atom) => (
        <ThreadInterface
          key={atom.toString()}
          className="mx-auto max-w-4xl flex-[1_0_min(100vw,24rem)] border-l last:border-r"
          threadAtom={atom}
          handleCloseThread={() => dispatch({ type: 'remove', atom })}
        />
      ))}
    </div>
  )
}
