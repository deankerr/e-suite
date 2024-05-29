import { useState } from 'react'
import { IconButton } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'

import { TextareaAuto } from '@/components/ui/TextareaAuto'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type InputBarProps = { thread: EThreadWithContent } & React.ComponentProps<'div'>

export const InputBar = ({ className, ...props }: InputBarProps) => {
  const [prompt, setPrompt] = useState('')

  return (
    <div {...props} className={cn('h-full gap-2 px-3 flex-between', className)}>
      <TextareaAuto value={prompt} onValueChange={setPrompt} />
      <IconButton
        variant="ghost"
        size="2"
        className=""
        // onClick={handleSendMessage}
      >
        <SendHorizonalIcon />
      </IconButton>
    </div>
  )
}
