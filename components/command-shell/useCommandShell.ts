import { useState } from 'react'
import { useKeyboardEvent } from '@react-hookz/web'
import { useMutation } from 'convex/react'
import { useAtom } from 'jotai'

import { useModelsApi } from '@/app/b/_providers/ModelsApiProvider'
import { useAppendMessage } from '@/app/b/api'
import { shellOpenAtom, shellStackAtom } from '@/components/command-shell/atoms'
import { api } from '@/convex/_generated/api'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'
import { useUserThreadsList, useViewerDetails } from '@/lib/queries'

import type { ShellMenuPageName } from '@/components/command-shell/Shell'
import type { InferenceConfig } from '@/convex/types'

export const useCommandShell = () => {
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

  return { user, isAdmin, threads, updateThread, removeThread }
}

const initialPage = 'ThreadComposer'

export type ShellHelpers = ReturnType<typeof useShell>
export const useShell = () => {
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

  const runConfig: InferenceConfig =
    inferenceType === 'chat'
      ? {
          type: 'chat-completion',
          resourceKey: chatModelKey,
          endpointModelId: '',
          endpoint: '',
        }
      : {
          type: 'text-to-image',
          resourceKey: imageModelKey,
          endpointModelId: '',
          endpoint: '',
          prompt: '',
          n: 4,
          width: 0,
          height: 0,
          size: 'square',
        }

  const { appendMessage, inputReadyState } = useAppendMessage()

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
    appendMessage,
    inputReadyState,
    inferenceType,
    runConfig,
    setInferenceType,
    currentModel,
    setModelKey,
  }
}
