import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { useCommandBar } from '@/components/command-bar/atoms'
import { CommandBarPanels } from '@/components/command-bar/bar/CommandBarPanels'
import { CommandBarRail } from '@/components/command-bar/bar/CommandBarRail'
import { Glass } from '@/components/ui/Glass'
import { cn } from '@/lib/utils'

import type { Variants } from 'framer-motion'

export const CommandBarShell = () => {
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

  const [mountPanels, setMountPanels] = useState(false)
  useEffect(() => {
    if (!mountPanels && !cmbr.isHidden && cmbr.isOpen) {
      setMountPanels(true)
    }
  }, [cmbr.isHidden, cmbr.isOpen, mountPanels])

  return (
    <div
      id="cmbr-container"
      className={cn(
        'pointer-events-none fixed left-1/2 top-0 flex w-full -translate-x-1/2 flex-col justify-end',
        cmbr.isHidden && 'hidden',
      )}
      style={{ maxWidth: cmbr.containerWidth, height: cmbr.containerHeight }}
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
            {mountPanels && <CommandBarPanels />}
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
          <CommandBarRail />
        </div>
      </div>
    </div>
  )
}
