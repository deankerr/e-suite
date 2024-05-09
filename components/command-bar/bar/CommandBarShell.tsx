import { motion } from 'framer-motion'

import { useCommandBar } from '@/components/command-bar/atoms'
import { Glass } from '@/components/ui/Glass'
import { cn } from '@/lib/utils'

import type { Variants } from 'framer-motion'

export const CommandBarShell = (props: { rail: React.ReactNode; panels: React.ReactNode }) => {
  const cmbr = useCommandBar()

  const marginGlass = 16
  const railTotalHeight = cmbr.layout.railInnerHeight + marginGlass
  const panelTotalHeight = cmbr.layout.panelInnerHeight + marginGlass * 2

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
        cmbr.isHidden && 'hidden',
      )}
      style={{ height: cmbr.containerHeight }}
    >
      <div className="flex h-full flex-col justify-end overflow-hidden" id="cmbr-panel-mask">
        <motion.div
          className={cn('pointer-events-auto absolute w-full')}
          variants={variants}
          animate={cmbr.isOpen ? 'open' : 'closed'}
          initial={false}
          style={{ height: panelTotalHeight }}
          id="cmbr-panel-container-m"
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
            style={{ width: '100%', height: cmbr.layout.panelInnerHeight + marginGlass * 3 }}
            id="cmbr-panel-glass-main"
          />

          <div className="absolute grid" style={{ inset: marginGlass }}>
            {props.panels}
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
          className="absolute grid"
          id="cmbr-rail"
          style={{
            insetBlockStart: 0,
            insetBlockEnd: marginGlass,
            insetInline: marginGlass,
          }}
        >
          {props.rail}
        </div>
      </div>
    </div>
  )
}
