import { useEffect, useState } from 'react'
import { useKeyboardEvent } from '@react-hookz/web'
import { useMutation } from 'convex/react'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useModelsApi } from '@/app/b/_providers/ModelsApiProvider'
import { useCreateThread } from '@/app/b/api'
import { appConfig } from '@/app/b/config'
import { shellOpenAtom, shellStackAtom } from '@/components/command-shell/atoms'
import { api } from '@/convex/_generated/api'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'
import { commandShellOpenAtom } from '@/lib/atoms'
import { useUserThreadsList, useViewerDetails } from '@/lib/queries'

import type { ShellMenuPageName } from '@/components/command-shell/Shell'

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

const initialPage = 'ThreadComposer'

export type ShellHelpers = ReturnType<typeof useShell>
export const useShell = () => {
  const router = useRouter()

  const [open, setOpen] = useAtom(shellOpenAtom)
  const close = () => setOpen(false)

  const [stack, setStack] = useAtom(shellStackAtom)
  const push = (page: ShellMenuPageName) => {
    setStack((prev) => [...prev, page])
  }
  const pop = () => {
    setStack((prev) => prev.slice(0, -1))
  }

  useKeyboardEvent('j', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      // setOpen(!open)
      if (open) {
        console.log('open -> close')
        setOpen(false)
      } else {
        console.log('close -> open')
        setOpen(true)
        if (stack.length === 0) push(initialPage)
      }
    }
  })

  const [inferenceType, setInferenceType] = useState<'chat' | 'textToImage'>('chat')
  const [chatModelKey, setChatModelKey] = useState(
    defaultChatInferenceConfig.resourceKey.toLowerCase(),
  )
  const [imageModelKey, setImageModelKey] = useState(defaultImageInferenceConfig.resourceKey)

  const setModelKey = (key: string) => {
    if (inferenceType === 'chat') {
      setChatModelKey(key)
    } else {
      setImageModelKey(key)
    }
  }

  const { chatModels, imageModels } = useModelsApi()
  const currentModel =
    inferenceType === 'chat'
      ? chatModels?.find((model) => model.resourceKey === chatModelKey)
      : imageModels?.find((model) => model.resourceKey === imageModelKey)

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

  // useEffect(() => {
  //   console.log(open, stack)
  // }, [open, stack])

  return {
    open,
    setOpen,
    close,
    stack,
    push,
    pop,
    chatModels,
    imageModels,
    createThread,
    inferenceType,
    setInferenceType,
    currentModel,
    setModelKey,
  }
}
