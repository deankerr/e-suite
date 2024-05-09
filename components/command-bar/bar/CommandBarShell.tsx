import { motion } from 'framer-motion'

import { useCommandBar } from '@/components/command-bar/atoms'
import { Glass } from '@/components/ui/Glass'
import { cn } from '@/lib/utils'

import type { Variants } from 'framer-motion'

export const CommandBarShell = () => {
  const cmbr = useCommandBar()

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
      id="cmbr-container"
      className={cn(
        'pointer-events-none fixed left-1/2 top-0 flex w-full max-w-3xl -translate-x-1/2 flex-col justify-end',
        !cmbr.isHidden && 'hidden',
      )}
      style={{ height: cmbr.containerHeight }}
    >
      <div className="flex h-full flex-col justify-end overflow-hidden" id="cmbr-panel-mask">
        <motion.div
          className={cn('pointer-events-auto absolute w-full')}
          variants={variants}
          animate={cmbr.isOpen ? 'open' : 'closed'}
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
}
