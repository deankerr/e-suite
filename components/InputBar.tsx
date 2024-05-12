'use client'

import { Button, IconButton, SegmentedControl } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

import { Glass } from '@/components/ui/Glass'

type InputBarProps = { props?: unknown }

export const InputBar = ({}: InputBarProps) => {
  return (
    <div className="fixed bottom-0 left-1/2 flex w-full -translate-x-1/2 flex-col justify-center">
      <div className="mx-auto w-full max-w-3xl p-4">
        <Glass barWidth={1} borderRadius={18} className="absolute inset-0 w-full" />
        <div className="mx-auto flex w-full flex-col gap-3 rounded-lg border bg-gray-1 p-3 text-lg">
          <div className="flex items-end gap-2">
            <TextareaAutosize
              maxRows={10}
              placeholder="A bird in the bush is worth two in my shoe..."
              className="w-full resize-none p-1 text-gray-12 outline-none placeholder:text-gray-9"
            />
            <div className="h-9 flex-end">
              <IconButton variant="ghost" size="2">
                <SendHorizonalIcon />
              </IconButton>
            </div>
          </div>

          <div className="gap-2 flex-between">
            <SegmentedControl.Root>
              <SegmentedControl.Item value="message">Chat</SegmentedControl.Item>
              <SegmentedControl.Item value="Generate">Generate</SegmentedControl.Item>
            </SegmentedControl.Root>

            <div className="flex-end">
              <Button variant="soft" size="2">
                {/* OpenAI: GPT-4 Turbo */}
                Stable Diffusion XL Lightning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
