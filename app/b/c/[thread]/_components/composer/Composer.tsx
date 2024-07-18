import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'
import { useSetAtom } from 'jotai'

import { useChat } from '@/app/b/c/[thread]/_provider/ChatProvider'
import {
  CreateChatThreadShell,
  CreateImageThreadShell,
} from '@/components/command-shell/pages/ThreadComposer'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { commandShellOpenAtom, createThreadShellOpenAtom } from '@/lib/atoms'
import { cn } from '@/lib/utils'

export const Composer = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const setOpen = useSetAtom(commandShellOpenAtom)

  const { thread, appendMessage } = useChat()

  const [promptValue, setPromptValue] = useState('')

  const addMessage = async () => {
    if (!thread || !promptValue) return

    await appendMessage({
      message: {
        text: promptValue,
      },
    })

    setPromptValue('')
  }

  const run = async () => {
    if (!thread) return

    const args = promptValue
      ? {
          message: {
            text: promptValue,
          },
          inference: thread.inference,
        }
      : {
          inference: thread.inference,
        }

    await appendMessage(args)
    setPromptValue('')
  }

  return (
    <div {...props} className={cn('min-h-10 shrink-0 px-1.5 py-1', className)}>
      <div className="flex flex-wrap items-center gap-1 overflow-hidden px-1 py-1 text-sm">
        <Button size="1" variant="outline" color="gold" className="max-w-[95%] justify-start">
          <Icons.Chat className="shrink-0" />
          <div className="truncate">{thread?.title}</div>
        </Button>

        <Button size="1" variant="outline" color="bronze" className="max-w-[95%] justify-start">
          <Icons.CodesandboxLogo className="shrink-0" />
          <div className="truncate">{thread?.model?.name}</div>
        </Button>
      </div>

      <TextareaAutosize
        placeholder="Message"
        className="border-none bg-transparent"
        value={promptValue}
        onValueChange={(value) => setPromptValue(value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            void run()
          }
        }}
      />

      <div className="flex gap-2 px-1 py-1">
        <IconButton variant="surface" onClick={() => setOpen(true)}>
          <Icons.List className="size-5" />
        </IconButton>

        <CreateChatThreadShell />
        <CreateImageThreadShell />

        <div className="grow"></div>

        <Button color="gray" disabled={!promptValue} onClick={addMessage}>
          Add
        </Button>
        <Button onClick={run}>
          Run
          <div className="hidden rounded bg-grayA-5 p-0.5 md:flex">
            <Icons.Command />
            <Icons.ArrowElbowDownLeft />
          </div>
        </Button>
      </div>
    </div>
  )
}

/* 
  <IconButton color="gray">
    <Icons.Plus />
  </IconButton>
  <Button color="orange">
    <Icons.PaperPlane className="size-4" />
  </Button>
*/
