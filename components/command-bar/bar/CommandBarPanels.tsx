import { motion } from 'framer-motion'

import { useCommandBar } from '@/components/command-bar/atoms'
import { panels } from '../atoms'

export const CommandBarPanels = () => {
  const cmbr = useCommandBar()

  return (
    <div className="overflow-hidden" style={{ height: cmbr.layout.panelInnerHeight }}>
      {panels.map((panel, i) => (
        <motion.div
          key={panel.id}
          className="absolute grid w-full"
          style={{ height: cmbr.layout.panelInnerHeight, left: `${i * 100}%` }}
          animate={{ x: `${-100 * cmbr.panelIndex}%` }}
          transition={{
            duration: 0.3,
            type: 'tween',
            ease: 'easeOut',
          }}
        >
          {panel.component && <panel.component />}
        </motion.div>
      ))}
    </div>
  )
}
