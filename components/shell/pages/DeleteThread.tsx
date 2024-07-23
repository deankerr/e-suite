import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { CmdK } from '@/components/shell/CmdK'
import { useIsCurrentPage, useShellStack, useShellUserThreads } from '@/components/shell/hooks'
import { api } from '@/convex/_generated/api'

export const DeleteThread = () => {
  const stack = useShellStack()
  const threads = useShellUserThreads()

  const sendRemoveThread = useMutation(api.db.threads.remove)

  const isCurrentPage = useIsCurrentPage('DeleteThread')
  if (!isCurrentPage) return null
  return (
    <>
      <CmdK.Group heading={`Delete: ${threads.current?.title ?? 'untitled'}`}>
        <CmdK.Item className="text-gray-11" onSelect={() => stack.pop()}>
          <Icons.CaretLeft weight="light" />
          Back
        </CmdK.Item>

        <CmdK.Item
          className="text-red-11 aria-selected:text-red-11"
          onSelect={async () => {
            if (!threads.current) return
            try {
              await sendRemoveThread({ threadId: threads.current._id })
              stack.clear()
            } catch (err) {
              console.error(err)
              toast.error('Failed to delete thread')
            }
          }}
        >
          <Icons.Trash weight="light" />
          Confirm
        </CmdK.Item>
      </CmdK.Group>
    </>
  )
}
