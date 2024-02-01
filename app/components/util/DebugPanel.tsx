'use client'

import { cn } from '@/lib/utils'
import { ToggleButton } from '../ui/ToggleButton'

const sides = {
  tl: 'top-1 left-1',
  tr: 'top-1 right-1',
  bl: 'bottom-1 left-1',
  br: 'bottom-1 right-1',
} as const

type DebugPanelProps = {
  side?: keyof typeof sides
}

const debugButtonProps = {
  trueProps: { variant: 'soft', color: 'blue' },
  falseProps: { variant: 'surface', color: 'orange' },
  size: '1',
} as const

export const DebugPanel = ({ side = 'br' }: DebugPanelProps) => {
  return (
    <div className={cn('fixed min-w-20', sides[side])}>
      <ToggleButton name="generationDrawerOpen" {...debugButtonProps} />
    </div>
  )
}
