import { useMutation } from 'convex/react'
import { useAtom } from 'jotai'

import { api } from '@/convex/_generated/api'
import { commandShellOpenAtom } from '@/lib/atoms'
import { useUserThreadsList, useViewerDetails } from '@/lib/queries'

export const useCommandShell = () => {
  const [open, setOpen] = useAtom(commandShellOpenAtom)
  const closeDialog = () => setOpen(false)

  const { user, isAdmin } = useViewerDetails()
  const threads = useUserThreadsList()

  const sendUpdateThread = useMutation(api.db.threads.update)
  const updateThread = async (args: Parameters<typeof sendUpdateThread>[0]) => {
    await sendUpdateThread(args)
  }

  const sendRemoveThread = useMutation(api.db.threads.remove)
  const removeThread = async (args: Parameters<typeof sendRemoveThread>[0]) => {
    await sendRemoveThread(args)
  }

  return { user, isAdmin, threads, closeDialog, updateThread, removeThread }
}
