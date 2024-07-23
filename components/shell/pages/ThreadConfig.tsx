import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom, useSetAtom } from 'jotai'

import { useThread } from '@/app/b/api'
import {
  shellStackAtom,
  shellThreadIdAtom,
  shellThreadTitleValueAtom,
} from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import { useIsCurrentPage } from '@/components/shell/hooks'

export const ThreadConfig = () => {
  const [threadId, setThreadId] = useAtom(shellThreadIdAtom)
  const thread = useThread(threadId)
  const setThreadTitleValue = useSetAtom(shellThreadTitleValueAtom)

  const [stack, setStack] = useAtom(shellStackAtom)

  const isCurrentPage = useIsCurrentPage('ThreadConfig')
  if (!isCurrentPage) return null
  return (
    <>
      {thread ? (
        <CmdK.Group heading={`Thread Config: ${thread.title}`}>
          <CmdK.Item
            onSelect={() => {
              setThreadTitleValue(thread.title ?? '')
              setStack([...stack, 'EditThreadTitle'])
            }}
          >
            <Icons.PencilLine weight="light" />
            Edit title...
          </CmdK.Item>
          <CmdK.Item>
            <Icons.CodesandboxLogo weight="light" />
            Model: {thread.model?.name ?? 'unknown model'}
          </CmdK.Item>
          <CmdK.Item>
            <Icons.UserSound weight="light" />
            Voiceover: {thread.voiceovers?.default ?? 'unknown model'}
          </CmdK.Item>
          <CmdK.Item className="text-red-11 aria-selected:text-red-11">
            <Icons.Trash weight="light" />
            Delete
          </CmdK.Item>
        </CmdK.Group>
      ) : thread === null ? (
        <CmdK.Item>Thread not found.</CmdK.Item>
      ) : (
        <CmdK.Loading />
      )}
    </>
  )
}
