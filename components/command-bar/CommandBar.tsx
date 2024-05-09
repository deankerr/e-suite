'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'

import { useCmbr } from '@/components/command-bar/atoms'
import { Glass } from '@/components/ui/Glass'
import { cn } from '@/lib/utils'

import type { Variants } from 'framer-motion'

// const panelConfig = [helloPanelDef, modelBrowserPanelDef, generationPanelDef, logsPanelDef]

export const CommandBar = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  function CommandBarAlpha(props, forwardedRef) {
    const cmbr = useCmbr()

    const containerHeight = 850

    const marginGlass = 16

    const railInnerHeight = 56
    const railTotalHeight = railInnerHeight + marginGlass

    const panelInnerHeight = 512
    const panelTotalHeight = panelInnerHeight + marginGlass * 2

    const variants: Variants = {
      open: {
        y: 0,
        transition: {
          type: 'spring',
          duration: '0.8',
        },
      },
      closed: {
        y: panelTotalHeight - marginGlass,
        transition: {
          type: 'tween',
          ease: 'anticipate',
          duration: '0.8',
        },
      },
    }

    return (
      <div
        {...props}
        id="cmbr-container"
        className={cn(
          'pointer-events-none fixed left-1/2 top-0 flex w-full max-w-3xl -translate-x-1/2 flex-col justify-end',
          !cmbr.values.isVisible && 'hidden',
        )}
        ref={forwardedRef}
        style={{ height: containerHeight }}
      >
        <div className="flex h-full flex-col justify-end overflow-hidden" id="cmbr-panel-mask">
          <motion.div
            className={cn('pointer-events-auto absolute w-full')}
            variants={variants}
            animate={cmbr.values.isOpen ? 'open' : 'closed'}
            id="cmbr-panel-container-m"
            style={{ height: panelTotalHeight }}
          >
            <Glass
              barWidth={1}
              borderTopLeftRadius={16}
              borderTopRightRadius={16}
              style={{ width: '100%', height: marginGlass }}
              id="cmbr-panel-glass-top"
            />
            <Glass
              barWidth={1}
              style={{ width: '100%', height: panelInnerHeight + marginGlass * 3 }}
              id="cmbr-panel-glass-main"
            />

            <div className="absolute rounded-lg bg-green-2" style={{ inset: marginGlass }}>
              panel
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-auto" id="cmbr-rail-container">
          <Glass
            barWidth={1}
            borderBottomLeftRadius={16}
            borderBottomRightRadius={16}
            id="cmbr-rail-glass"
            style={{ height: railTotalHeight }}
          />

          <div
            className="absolute rounded-lg bg-cyan-2"
            id="cmbr-rail"
            style={{ insetBlockStart: 0, insetBlockEnd: marginGlass, insetInline: marginGlass }}
          >
            rail
          </div>
        </div>
      </div>
    )
  },
)

/*
slider
  <div
              className={cn('w-full overflow-hidden rounded-lg', !cmbr.values.isOpen && '')}
              id="cmbr-panel-shifter-mask"
            >
              <motion.div
                className="flex h-full"
                animate={{ x: `-${cmbr.values.panelIndex * 100}%` }}
                id="cmbr-panel-shifter"
              >
                {panelConfig.map((panel) => (
                  <panel.element key={panel.id} />
                ))}
              </motion.div>
            </div>

*/

/* rail
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
*/
