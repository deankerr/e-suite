import { useAtom } from 'jotai'

import { commandShellOpenAtom } from '@/lib/atoms'
import { useUserThreadsList, useViewerDetails } from '@/lib/queries'

export const useCommandShell = () => {
  const [open, setOpen] = useAtom(commandShellOpenAtom)
  const closeDialog = () => setOpen(false)

  const { user, isAdmin } = useViewerDetails()
  const threads = useUserThreadsList()

  return { user, isAdmin, threads, closeDialog }
}
