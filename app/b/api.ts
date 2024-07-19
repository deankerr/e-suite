import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { appConfig } from '@/app/b/config'
import { useShell } from '@/components/command-shell/useCommandShell'
import { api } from '@/convex/_generated/api'

export const useCreateThread = () => {
  const { close } = useShell()
  const router = useRouter()
  const sendCreateThread = useMutation(api.db.threadsB.create)

  const createThread = async (args: Parameters<typeof sendCreateThread>[0]) => {
    try {
      const result = await sendCreateThread(args)
      router.push(`${appConfig.chatUrl}/${result.slug}`)
      close()
    } catch (err) {
      console.error(err)
      toast.error('An error occurred while trying to create a new thread.')
    }
  }

  return createThread
}
