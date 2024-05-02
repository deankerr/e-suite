'use client'

import { Button } from '@radix-ui/themes'
import { AnimatePresence, motion } from 'framer-motion'
import { useControls } from 'leva'
import { MenuIcon } from 'lucide-react'

import { Glass } from '../ui/Glass'

type CommandBarProps = { props?: unknown }

export const CommandBar = ({}: CommandBarProps) => {
  const [leva, set, get] = useControls('command bar', () => ({
    mount: true,
    open: false,
  }))

  const openClose = {
    containers: {
      height: leva.open ? 512 : 72,
      width: 768,
      borderRadius: 12,
      position: 'absolute' as const,
      bottom: 0,
    },
  }

  if (!leva.mount) return null
  return (
    <div className="height-[512] fixed inset-x-0 bottom-1/3 flex justify-center">
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
        className="overflow-hidden"
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
                height: 416,
                margin: 12,
                padding: 8,
                borderRadius: 12,
                backgroundColor: 'var(--gray-2)',
                position: 'absolute',
                insetInline: 0,
              }}
            >
              <Button variant="surface" color="bronze">
                Demo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          style={{
            height: 60,
            margin: 12,
            padding: 8,
            borderRadius: 12,
            backgroundColor: 'var(--gray-2)',
            position: 'absolute',
            bottom: 0,
            insetInline: 0,
          }}
        >
          <Button
            variant="surface"
            style={{ height: '100%', borderRadius: 8 }}
            onClick={() => set({ open: !get('open') })}
          >
            <MenuIcon />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
