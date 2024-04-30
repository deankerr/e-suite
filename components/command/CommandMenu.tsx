import { useState } from 'react'
import { Button } from '@radix-ui/themes'
import { MenuIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ChatInputCard } from './ChatInputCard'
import { GenerationInputCard } from './GenerationInputCard'

type CommandMenuProps = { props?: unknown }

export const CommandMenu = ({}: CommandMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeInput, setActiveInput] = useState<'message' | 'generation'>('message')
  return (
    <div
      className={cn(
        'mx-auto h-20 w-fit max-w-3xl overflow-hidden rounded-xl border bg-panel-translucent p-2 transition-all duration-500',
        isOpen && 'h-[512px] w-full',
      )}
    >
      <div className="h-full gap-2 overflow-hidden flex-col-end">
        <div className="h-[422px] w-full shrink-0 grow space-y-4 rounded-lg bg-gray-1 p-3">
          {activeInput === 'generation' ? <GenerationInputCard /> : <ChatInputCard />}
        </div>

        {/* bottom section */}
        <div className="flex h-16 w-full shrink-0 items-center gap-4 rounded-lg bg-gray-1 p-1">
          <Button variant="outline" color="orange" size="4" onClick={() => setIsOpen(!isOpen)}>
            <MenuIcon />
          </Button>
          <Button
            variant="surface"
            color="gold"
            className="font-mono text-base"
            size="4"
            onClick={() => setActiveInput('generation')}
          >
            Generate
          </Button>
          <Button
            variant="surface"
            color="gold"
            className="font-mono text-base"
            size="4"
            onClick={() => setActiveInput('message')}
          >
            Message
          </Button>
        </div>
      </div>
    </div>
  )
}
