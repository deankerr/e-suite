import { forwardRef } from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type PanelShellProps = { props?: unknown } & React.ComponentProps<typeof motion.div>

const defHeight = 512

export const PanelShell = forwardRef<HTMLDivElement, PanelShellProps>(function PanelShell(
  { className, ...props },
  forwardedRef,
) {
  return (
    <motion.div
      {...props}
      className={cn('grid h-full w-full flex-none rounded-lg bg-gray-2', className)}
      style={{ height: defHeight }}
      ref={forwardedRef}
    />
  )
})
