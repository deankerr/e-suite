import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'

import { useChat } from '@/app/dev/lo36/c/[thread]/_provider/ChatProvider'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { cn } from '@/lib/utils'

export const Composer = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { thread } = useChat()

  const [promptValue, setPromptValue] = useState('')

  return (
    <div {...props} className={cn('min-h-8 shrink-0 bg-gray-1 px-1.5 py-1', className)}>
      <div className="flex flex-wrap items-center gap-1 overflow-hidden px-1 py-1 text-sm">
        {/* <div className="flex items-center gap-1 rounded border border-grayA-3 bg-grayA-2 px-1 py-0.5">
          <Icons.Chat />
          dev kamehub
        </div> */}

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
      />

      <div className="flex gap-2 px-1 py-1">
        <IconButton variant="outline" color="gray">
          <Icons.Paperclip />
        </IconButton>

        <div className="grow"></div>

        {/* <IconButton color="gray">
          <Icons.Plus />
        </IconButton>
        <Button color="orange">
          <Icons.PaperPlane className="size-4" />
        </Button> */}

        <Button color="gray">Add</Button>
        <Button>
          Run
          <div className="hidden rounded bg-grayA-5 p-0.5 md:flex">
            <Icons.Command />
            <Icons.ArrowElbowDownLeft />
          </div>
          {/* <Icons.PaperPlane className="size-4" /> */}
        </Button>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 hidden translate-x-2 scale-75 px-1 font-mono text-xs text-gold-11">
        composer
      </div>
    </div>
  )
}
