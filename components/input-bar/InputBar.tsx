'use client'

import { useState } from 'react'
import { Button, IconButton, SegmentedControl } from '@radix-ui/themes'
import { motion } from 'framer-motion'
import { SendHorizonalIcon } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

import { ModelBrowserPanel } from '@/components/input-bar/ModelBrowserPanel'
import { Glass } from '@/components/ui/Glass'

import type { Temp_EModels } from '@/convex/models'

type InputBarProps = { props?: unknown }

export const InputBar = ({}: InputBarProps) => {
  const [panel, setPanel] = useState('textarea')
  const [currentModel, setCurrentModel] = useState<Temp_EModels[number] | undefined>()

  return (
    <div className="fixed bottom-0 left-1/2 flex w-full -translate-x-1/2 flex-col justify-center">
      <motion.div layout className="mx-auto w-full max-w-3xl p-4">
        <Glass layout barWidth={1} borderRadius={18} className="absolute inset-0 w-full" />
        <motion.div layout className="rounded-lg bg-gray-1 p-3">
          {/* <div className="h-80">models</div> */}
          {panel === 'models' && (
            <ModelBrowserPanel
              currentModel={currentModel}
              setCurrentModel={setCurrentModel}
              setPanel={setPanel}
            />
          )}
          {panel === 'textarea' && <TextareaPanel setPanel={setPanel} />}
        </motion.div>
      </motion.div>
    </div>
  )
}

type TAProps = {
  setPanel: (panel: string) => void
}
const TextareaPanel = ({ setPanel }: TAProps) => {
  return (
    <div className="flex flex-col gap-3 text-lg">
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
          <Button variant="soft" size="2" onClick={() => setPanel('models')}>
            {/* OpenAI: GPT-4 Turbo */}
            Stable Diffusion XL Lightning
          </Button>
        </div>
      </div>
    </div>
  )
}
