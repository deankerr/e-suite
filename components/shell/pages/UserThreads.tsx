import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtomValue, useSetAtom } from 'jotai'

import { shellSearchValueAtom, shellThreadIdAtom } from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import { useIsCurrentPage, useShellStack } from '@/components/shell/hooks'
import { useUserThreadsList } from '@/lib/queries'

export const UserThreads = () => {
  const threads = useUserThreadsList()

  const setThreadId = useSetAtom(shellThreadIdAtom)
  const stack = useShellStack()
  const searchValue = useAtomValue(shellSearchValueAtom)

  const isCurrentPage = useIsCurrentPage('UserThreads')
  if (!isCurrentPage && stack.current !== undefined) return null

  const threadsList = isCurrentPage || searchValue ? threads : threads?.slice(0, 5)
  return (
    <>
      {threadsList ? (
        <CmdK.Group heading="Threads">
          {threadsList.map((thread) => (
            <CmdK.Item
              key={thread._id}
              value={`${thread.title ?? 'untitled'} ${thread.slug}`}
              onSelect={() => {
                setThreadId(thread._id)
                stack.push('ThreadConfig')
              }}
            >
              {thread.model?.type === 'chat' ? (
                <Icons.Chat className="-mt-0.5" />
              ) : (
                <Icons.ImageSquare />
              )}
              <div className="truncate">{thread.title ?? 'Untitled'}</div>
            </CmdK.Item>
          ))}
        </CmdK.Group>
      ) : (
        <CmdK.Loading>Loading threads...</CmdK.Loading>
      )}
    </>
  )
}
