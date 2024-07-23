import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useMutation } from 'convex/react'
import { useAtom } from 'jotai'
import { toast } from 'sonner'

import { useThread } from '@/app/b/api'
import {
  shellStackAtom,
  shellThreadIdAtom,
  shellThreadTitleValueAtom,
} from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import { useIsCurrentPage } from '@/components/shell/hooks'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { TextField } from '@/components/ui/TextField'
import { api } from '@/convex/_generated/api'

export const EditThreadTitle = () => {
  const [threadId, setThreadId] = useAtom(shellThreadIdAtom)
  const thread = useThread(threadId)
  const [threadTitleValue, setThreadTitleValue] = useAtom(shellThreadTitleValueAtom)

  const sendUpdateThread = useMutation(api.db.threads.update)
  const [isPending, setIsPending] = useState(false)

  const handleUpdateThread = async () => {
    if (!threadId) return
    setIsPending(true)

    try {
      await sendUpdateThread({
        threadId: threadId,
        fields: { title: threadTitleValue },
      })
    } catch (err) {
      console.error(err)
      toast.error('Failed to update thread title')
    }
    setIsPending(false)
  }

  const [stack, setStack] = useAtom(shellStackAtom)
  const isCurrentPage = useIsCurrentPage('EditThreadTitle')
  if (!isCurrentPage) return null
  return (
    <>
      <CmdK.Group heading="Edit title">
        <TextField
          size="3"
          className="m-1 mb-2"
          placeholder="Enter new title..."
          value={threadTitleValue}
          onValueChange={setThreadTitleValue}
        />
        <CmdK.Item
          className="text-grass-11 aria-selected:text-grass-11"
          onSelect={() => {
            void handleUpdateThread()
          }}
          disabled={isPending}
        >
          {isPending ? (
            <LoadingSpinner className="bg-gray-11" />
          ) : (
            <>
              <Icons.Check weight="light" />
              Save
            </>
          )}
        </CmdK.Item>
        <CmdK.Item
          className="text-gray-11"
          onSelect={() => {
            setStack(stack.slice(0, -1))
          }}
          disabled={isPending}
        >
          <Icons.CaretLeft weight="light" />
          Back
        </CmdK.Item>
      </CmdK.Group>
    </>
  )
}
