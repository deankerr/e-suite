'use client'

import { forwardRef } from 'react'
import { Button, IconButton } from '@radix-ui/themes'
import { motion } from 'framer-motion'
import { MenuIcon } from 'lucide-react'

import { useCmbLayoutAtom, useCmbrPanelsAtom } from '@/components/command-bar/alphaAtoms'
import { helloPanelDef } from '@/components/command-bar/HelloPanel'
import { logsPanelDef } from '@/components/command-bar/LogPanel'
import { modelBrowserPanelDef } from '@/components/command-bar/ModelBrowserPanel'
import { Glass } from '@/components/ui/Glass'
import { cn } from '@/lib/utils'

const panelConfig = [helloPanelDef, modelBrowserPanelDef, logsPanelDef]

type CommandBarAlphaProps = { props?: unknown } & React.ComponentProps<'div'>

export const CommandBarAlpha = forwardRef<HTMLDivElement, CommandBarAlphaProps>(
  function CommandBarAlpha(props, forwardedRef) {
    const cmbRailHeight = 80
    const bounceRoom = 18

    const [{ containerHeightPc, panelHeight, panelOpen, rounded }] = useCmbLayoutAtom()

    const variants = {
      open: {
        y: 0,
      },
      closed: {
        y: panelHeight - cmbRailHeight - bounceRoom,
      },
    }

    const [{ index }, setPanels] = useCmbrPanelsAtom()

    return (
      <div
        {...props}
        id="home"
        className={cn(
          'fixed left-1/2 top-0 flex w-full max-w-3xl -translate-x-1/2 flex-col justify-end overflow-hidden',
          rounded && 'rounded-xl',
        )}
        ref={forwardedRef}
        style={{ height: `${containerHeightPc}%` }}
      >
        <motion.div
          className="absolute w-full p-4 pb-24 pt-6"
          style={{ height: panelHeight }}
          variants={variants}
          animate={panelOpen ? 'open' : 'closed'}
        >
          <Glass
            barWidth={1}
            borderRadius={16}
            className="absolute inset-0 rounded-2xl border border-gold-5"
          />

          <div className="h-full w-full overflow-hidden rounded-lg border">
            <motion.div className="flex h-full" animate={{ x: `-${index * 100}%` }}>
              {panelConfig.map((panel) => (
                <panel.element key={panel.id} />
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="m-4 h-14 rounded-lg border bg-gray-2 p-2 font-mono text-xs">
          <div className="flex-between">
            <div className="flex gap-2">
              <IconButton variant="surface" size="3">
                <MenuIcon />
              </IconButton>

              <Button variant="surface" size="3" className="font-mono text-sm">
                Chat
              </Button>
              <Button variant="surface" size="3" className="font-mono text-sm">
                Generate
              </Button>
            </div>

            <div className="flex-center">
              <IconButton
                variant="surface"
                size="3"
                onClick={() => setPanels((o) => ({ ...o, index: index - 1 }))}
              >
                -
              </IconButton>
              <div className="px-2">{index}</div>
              <IconButton
                variant="surface"
                size="3"
                onClick={() => setPanels((o) => ({ ...o, index: index + 1 }))}
              >
                +
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    )
  },
)
