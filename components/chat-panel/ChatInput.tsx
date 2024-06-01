import { useState } from 'react'
import { IconButton } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Textarea } from '@/components/ui/Textarea'
import { useCreateMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type ChatInputProps = { thread: EThreadWithContent } & React.ComponentProps<'div'>

export const ChatInput = ({ thread, className, ...props }: ChatInputProps) => {
  const createMessage = useCreateMessage()
  const [prompt, setPrompt] = useState('')

  const handleSendMessage = async () => {
    try {
      const inference = { ...thread.active }
      if (inference.type === 'text-to-image') inference.parameters.prompt = prompt

      await createMessage({ threadId: thread.slug, message: { role: 'user', content: prompt } })

      await createMessage({
        threadId: thread.slug,
        message: { role: 'assistant', inference: thread.active },
      })

      setPrompt('')
    } catch (err) {
      console.error(err)
      toast.error('An error occurred')
    }
  }
  return (
    <div {...props} className={cn('h-full gap-2 px-3 py-2 flex-between', className)}>
      <Textarea
        placeholder="Prompt..."
        value={prompt}
        onValueChange={setPrompt}
        onKeyDown={(e) => {
          if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void handleSendMessage()
          }
        }}
      />
      <IconButton variant="ghost" size="2" onClick={() => void handleSendMessage()}>
        <SendHorizonalIcon />
      </IconButton>
    </div>
  )
}
