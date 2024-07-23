import * as Icons from '@phosphor-icons/react/dist/ssr'

import { CmdK } from '@/components/shell/CmdK'
import { useShellStack, useShellUserThreads } from '@/components/shell/hooks'

export const UserThreads = () => {
  const threads = useShellUserThreads()
  const stack = useShellStack()

  if (stack.current !== undefined) return null
  return (
    <>
      {threads.list ? (
        <CmdK.Group heading="Threads">
          {threads.list.map((thread) => (
            <CmdK.Item
              key={thread._id}
              value={`${thread.title ?? 'untitled'} ${thread.slug}`}
              onSelect={() => {
                threads.select(thread)
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
