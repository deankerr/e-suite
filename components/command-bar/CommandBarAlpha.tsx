'use client'

import { forwardRef } from 'react'
import { Button, IconButton } from '@radix-ui/themes'
import { motion } from 'framer-motion'
import { MenuIcon } from 'lucide-react'

import { useCmbr } from '@/components/command-bar/alphaAtoms'
import { generationInputPanelDef } from '@/components/command-bar/GenerationInputPanel'
import { helloPanelDef } from '@/components/command-bar/HelloPanel'
import { logsPanelDef } from '@/components/command-bar/LogPanel'
import { modelBrowserPanelDef } from '@/components/command-bar/ModelBrowserPanel'
import { Glass } from '@/components/ui/Glass'
import { cn } from '@/lib/utils'

import type { ButtonProps } from '@radix-ui/themes'

const panelConfig = [helloPanelDef, modelBrowserPanelDef, generationInputPanelDef, logsPanelDef]

type CommandBarAlphaProps = { props?: unknown } & React.ComponentProps<'div'>

export const CommandBarAlpha = forwardRef<HTMLDivElement, CommandBarAlphaProps>(
  function CommandBarAlpha(props, forwardedRef) {
    const openOffset = 64
    const closedOffset = -20
    const panelInnerHeight = 448

    const cmbr = useCmbr()

    const variants = {
      open: {
        y: 0 + openOffset,
      },
      closed: {
        y: cmbr.values.panelHeight + closedOffset,
      },
    }

    return (
      <div
        {...props}
        id="home"
        className={cn(
          'pointer-events-none fixed left-1/2 top-0 flex w-full max-w-3xl -translate-x-1/2 flex-col justify-end',
          !cmbr.values.isVisible && 'hidden',
        )}
        ref={forwardedRef}
        style={{ height: `${cmbr.values.containerHeightPc}%` }}
      >
        <div className="flex h-full flex-col justify-end overflow-hidden">
          <motion.div
            className={cn('pointer-events-auto absolute w-full p-4')}
            style={{ height: cmbr.values.panelHeight }}
            variants={variants}
            animate={cmbr.values.isOpen ? 'open' : 'closed'}
          >
            <Glass
              barWidth={1}
              borderTopLeftRadius={16}
              borderTopRightRadius={16}
              className="absolute inset-0 rounded-2xl"
            />

            <div
              className={cn('w-full overflow-hidden rounded-lg', !cmbr.values.isOpen && 'hidden')}
              style={{ height: panelInnerHeight }}
            >
              <motion.div
                className="flex h-full"
                animate={{ x: `-${cmbr.values.panelIndex * 100}%` }}
              >
                {panelConfig.map((panel) => (
                  <panel.element key={panel.id} />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-auto">
          <Glass
            barWidth={1}
            borderBottomLeftRadius={16}
            borderBottomRightRadius={16}
            className="absolute inset-0 rounded-2xl"
          />
          <div className="mx-4 mb-4 h-14 rounded-lg bg-gray-2 p-2 font-mono text-xs">
            <div className="flex-between">
              <div className="flex gap-2">
                <IconButton
                  variant="surface"
                  size="3"
                  onClick={() => cmbr.set((o) => ({ ...o, isOpen: !o.isOpen }))}
                >
                  <MenuIcon />
                </IconButton>

                {panelConfig.map((panel, i) => (
                  <Button
                    key={panel.id}
                    variant="surface"
                    size="3"
                    color={panel.buttonColor as ButtonProps['color']}
                    className="font-mono text-sm"
                    onClick={() => cmbr.set((o) => ({ ...o, panelIndex: i, isOpen: true }))}
                  >
                    {panel.name}
                  </Button>
                ))}
              </div>

              <div className="flex-center">
                <IconButton
                  variant="surface"
                  size="3"
                  onClick={() => cmbr.set((o) => ({ ...o, panelIndex: o.panelIndex - 1 }))}
                >
                  -
                </IconButton>
                <div className="px-2">{cmbr.values.panelIndex}</div>
                <IconButton
                  variant="surface"
                  size="3"
                  onClick={() => cmbr.set((o) => ({ ...o, panelIndex: o.panelIndex + 1 }))}
                >
                  +
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)
