'use client'

import { useState } from 'react'
import { Button, IconButton } from '@radix-ui/themes'
import { useWindowSize } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useControls } from 'leva'
import { MenuIcon } from 'lucide-react'

import { GenerationInputCard } from '@/components/command-bar/GenerationInputCard'
import { GenericGenerationInput } from '@/components/command-bar/GenericGenerationInput'
import { ModelBrowserCard } from '@/components/command-bar/ModelBrowserCard'
import { environment } from '@/lib/utils'
import { Glass } from '../ui/Glass'

const tabs = {
  gen0: GenerationInputCard,
  gen1: GenericGenerationInput,
  models: ModelBrowserCard,
} as const

type CommandBarProps = { props?: unknown }

export const CommandBar = ({}: CommandBarProps) => {
  const [ctab, setTab] = useState<keyof typeof tabs>('gen1')

  const [leva, set, get] = useControls('command bar', () => ({
    mount: environment !== 'prod',
    open: false,
    mobile_width: false,
    full_height: false,
  }))
  const size = useWindowSize()

  const cmdBarHeight = leva.full_height && size.height ? size.height - 50 : 512

  const openClose = {
    containers: {
      height: leva.open ? cmdBarHeight : 84,
      width: leva.mobile_width ? 320 : 768,
      borderRadius: 12,
      position: 'absolute' as const,
      bottom: 0,
    },
  }

  if (!leva.mount) return null
  const Current = tabs[ctab]
  return (
    <div className="height-[512] fixed inset-x-0 bottom-8 flex justify-center">
      <Glass
        style={openClose.containers}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        barWidth={1}
        type="linear"
        borderRadius={12}
      />

      <motion.div
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={openClose.containers}
        className="overflow-hidden border"
      >
        <AnimatePresence>
          {leva.open && (
            <motion.div
              layout
              key="cmd"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                height: cmdBarHeight - 96,
                margin: 12,
                borderWidth: 1,
                borderColor: 'var(--gray-3)',
                borderRadius: 12,
                backgroundColor: 'var(--gray-2)',
                insetInline: 0,
              }}
            >
              <Current />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          style={{
            position: 'absolute',
            bottom: 0,
            height: 60,
            margin: 12,
            padding: 8,
            borderWidth: 1,
            borderColor: 'var(--gray-3)',
            borderRadius: 12,
            backgroundColor: 'var(--gray-2)',
            insetInline: 0,
          }}
        >
          <div className="h-full gap-2 flex-start">
            <IconButton
              variant="surface"
              className="h-full rounded-lg font-mono"
              size="3"
              onClick={() => set({ open: !get('open') })}
            >
              <MenuIcon />
            </IconButton>

            <Button
              variant="surface"
              color="bronze"
              className="h-full rounded-lg font-mono"
              onClick={() => setTab('gen0')}
            >
              Generate 0
            </Button>

            <Button
              variant="surface"
              color="orange"
              className="h-full rounded-lg font-mono"
              onClick={() => setTab('gen1')}
            >
              Generate 1
            </Button>

            <Button
              variant="surface"
              color="cyan"
              className="h-full rounded-lg font-mono"
              onClick={() => setTab('models')}
            >
              Models
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
