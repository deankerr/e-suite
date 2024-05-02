'use client'

import { Button, IconButton } from '@radix-ui/themes'
import { AnimatePresence, motion } from 'framer-motion'
import { useControls } from 'leva'
import { MenuIcon } from 'lucide-react'

import { GenerationInputCard } from '@/components/command-bar/GenerationInputCard'
import { environment } from '@/lib/utils'
import { Glass } from '../ui/Glass'

type CommandBarProps = { props?: unknown }

export const CommandBar = ({}: CommandBarProps) => {
  const [leva, set, get] = useControls('command bar', () => ({
    mount: environment !== 'prod',
    open: false,
  }))

  const openClose = {
    containers: {
      height: leva.open ? 512 : 84,
      width: 768,
      borderRadius: 12,
      position: 'absolute' as const,
      bottom: 0,
    },
  }

  if (!leva.mount) return null
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
                height: 416,
                margin: 12,
                padding: 8,
                borderWidth: 1,
                borderColor: 'var(--gray-3)',
                borderRadius: 12,
                backgroundColor: 'var(--gray-2)',
                insetInline: 0,
              }}
            >
              <GenerationInputCard />
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

            <Button variant="surface" color="bronze" className="h-full rounded-lg font-mono">
              Chat
            </Button>

            <Button variant="surface" color="orange" className="h-full rounded-lg font-mono">
              Generate
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
