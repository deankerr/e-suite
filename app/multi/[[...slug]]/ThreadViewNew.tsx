'use client'

import { useState } from 'react'
import { IconButton } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'

import { ModelCombobox } from '@/components/model-picker/ModelCombobox'
import { TextareaAuto } from '@/components/ui/TextareaAuto'
import { cn } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/ban-types
type ThreadViewProps = {} & React.ComponentProps<'div'>

export const ThreadViewNew = ({ className, ...props }: ThreadViewProps) => {
  const [model, setModel] = useState('openai::gpt-4o')

  return (
    <div {...props} className={cn('flex max-w-4xl flex-col overflow-y-auto', className)}>
      <div className="sticky top-0 z-10 h-11 shrink-0 border-b bg-gray-1 text-sm flex-center">
        New Thread
      </div>

      <div className="flex grow flex-col gap-4 p-2">
        <ModelCombobox value={model} onValueChange={setModel} />
      </div>

      <div className="sticky bottom-0 z-10 shrink-0 border-t bg-gray-1 p-3 text-base flex-center">
        <TextareaAuto />
        <IconButton variant="ghost" size="2" className="absolute bottom-4 right-5 my-0 -mb-[1px]">
          <SendHorizonalIcon className="size-6" />
        </IconButton>
      </div>
    </div>
  )
}
