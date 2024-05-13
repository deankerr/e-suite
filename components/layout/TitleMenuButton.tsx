'use client'

import { Select } from '@radix-ui/themes'
import { useAtom } from 'jotai'

import { Spinner } from '@/components/ui/Spinner'
import { useThread, useThreads } from '@/lib/api2'
import { activeThreadAtom } from '@/lib/atoms'

type TitleMenuButtonProps = { props?: unknown }

export const TitleMenuButton = ({}: TitleMenuButtonProps) => {
  const [activeThread, setActiveThread] = useAtom(activeThreadAtom)

  const { results: threads } = useThreads()

  return (
    <div className="flex w-full">
      {activeThread ? (
        <Select.Root
          value={activeThread.rid}
          onValueChange={(rid) => {
            const nextThread = threads.find((thread) => thread.rid === rid)
            setActiveThread(nextThread)
          }}
        >
          <Select.Trigger className="mx-auto w-full max-w-60 text-center [&>span]:grow" />

          <Select.Content position="popper">
            {threads.map((thread) => (
              <Select.Item key={thread._id} value={thread.rid}>
                {thread.title ?? 'Untitled'}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
