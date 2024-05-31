import { IconButton } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'

import { AutosizeTextarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'

type ChatInputProps = { props?: unknown } & React.ComponentProps<'div'>

export const ChatInput = ({ className, ...props }: ChatInputProps) => {
  return (
    <div {...props} className={cn('h-full gap-2 px-3 py-2 flex-between', className)}>
      <AutosizeTextarea
        onKeyDown={(e) => {
          if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault()
            // void handleSendMessage()
          }
        }}
      />
      <IconButton variant="ghost" size="2">
        <SendHorizonalIcon />
      </IconButton>
    </div>
  )
}
