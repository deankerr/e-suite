import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'

import { useChat } from '@/components/chat/ChatProvider'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { EMessage } from '@/convex/types'
import { cn } from '@/lib/utils'

export const Editor = ({
  message,
  onClose,
  className,
  ...props
}: { message: EMessage; onClose: () => unknown } & React.ComponentProps<'div'>) => {
  const [content, setContent] = useState(message.content)
  const { updateMessage } = useChat()

  return (
    <div {...props} className={cn('w-full rounded-lg bg-grayA-2', className)}>
      <div className="gap-3 px-1.5 py-1.5 flex-end">
        <IconButton variant="soft" size="1" color="red" className="" onClick={onClose}>
          <Icons.X className="size-5" />
        </IconButton>

        <IconButton
          variant="soft"
          size="1"
          color="green"
          className=""
          onClick={() => {
            void updateMessage({
              messageId: message._id,
              role: message.role,
              name: message.name,
              content,
            })
            onClose()
          }}
        >
          <Icons.Check className="size-5" />
        </IconButton>
      </div>
      <TextareaAutosize
        className="w-full font-mono text-sm"
        value={content}
        onValueChange={(value) => setContent(value)}
      />
    </div>
  )
}
