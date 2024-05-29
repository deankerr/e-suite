import { useState } from 'react'
import { IconButton } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'
import { toast } from 'sonner'

import { TextareaAuto } from '@/components/ui/TextareaAuto'
import { useCreateMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type ThreadInputBarProps = { thread: EThreadWithContent } & React.ComponentProps<'div'>

export const ThreadInputBar = ({ thread, className, ...props }: ThreadInputBarProps) => {
  const createMessage = useCreateMessage()
  const inference = thread.inferenceConfig[thread.inferenceConfig.primary]
  const [prompt, setPrompt] = useState('')

  const sendMessage = async () => {
    try {
      const newInference = { ...inference }
      if (newInference.type === 'text-to-image') newInference.parameters.prompt = prompt

      await createMessage({
        threadId: thread.slug,
        message: { role: 'user', content: prompt },
      })

      await createMessage({
        threadId: thread.slug,
        message: { role: 'assistant', inference },
      })

      setPrompt('')
    } catch (err) {
      console.error(err)
      toast.error('An error occurred')
    }
  }
  const handleSendMessage = () => void sendMessage()
  return (
    <div {...props} className={cn('h-full p-3 flex-center', className)}>
      <TextareaAuto value={prompt} onValueChange={setPrompt} />
      <IconButton
        variant="ghost"
        size="2"
        className="absolute bottom-4 right-5 my-0 -mb-[1px]"
        onClick={handleSendMessage}
      >
        <SendHorizonalIcon className="size-6" />
      </IconButton>
    </div>
  )
}
