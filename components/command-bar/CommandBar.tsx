'use client'

import { useRef, useState } from 'react'
import { Button, IconButton } from '@radix-ui/themes'
import { useWindowSize } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useControls } from 'leva'
import { MenuIcon } from 'lucide-react'

import { usePanelsAtom } from '@/components/command-bar/atoms'
import { Monitor } from '@/components/command-bar/Monitor'
import { useModelList } from '../../lib/queries'
import { Glass } from '../ui/Glass'

export const CommandBar = () => {
  const [leva, set, get] = useControls(
    'command bar',
    () => ({
      mount: false,
      open: true,
      mobile_width: false,
      full_height: false,
      width: {
        value: 768,
        min: 320,
        max: 1200,
        step: 8,
      },
    }),
    { collapsed: true },
  )
  const size = useWindowSize()

  const cmdBarHeight = leva.full_height && size.height ? size.height - 50 : 512

  const openClose = {
    containers: {
      height: leva.open ? cmdBarHeight : 84,
      width: leva.width,
      borderRadius: 12,
      position: 'absolute' as const,
      bottom: 0,
    },
  }

  // watch
  useModelList()

  const panelRefs = useRef<{ [id: string]: HTMLDivElement | null }>({})
  const [panels] = usePanelsAtom()
  const [moveIndex, setMoveIndex] = useState(0)

  const movePanels = (x: number) => {
    setMoveIndex((c) => c + x)
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
        className=" border"
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
              <motion.div
                style={{ height: '100%' }}
                animate={{ x: moveIndex * 740 }}
                className="border border-pink-9"
              >
                {panels.map((panel, i) => (
                  <panel.el
                    key={panel.panelId}
                    ref={(ref) => {
                      panelRefs.current[panel.panelId] = ref
                    }}
                    name={panel.name}
                    style={{ position: 'absolute', top: 0, bottom: 0, left: i * 740 }}
                  />
                ))}
              </motion.div>
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

            {panels.map((panel) => (
              <Button key={panel.panelId} {...panel.buttonProps}>
                {panel.name}
              </Button>
            ))}

            <Button onClick={() => movePanels(-1)}>-</Button>
            <Button onClick={() => movePanels(1)}>+</Button>
            <Monitor />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
