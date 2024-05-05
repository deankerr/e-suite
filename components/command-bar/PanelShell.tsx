import { forwardRef, Suspense } from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type PanelShellProps = { props?: unknown } & React.ComponentProps<typeof motion.div>

export const PanelShell = forwardRef<HTMLDivElement, PanelShellProps>(function PanelShell(
  { className, ...props },
  forwardedRef,
) {
  return (
    <Suspense fallback={<div>panel suspended</div>}>
      <motion.div
        {...props}
        className={cn('grid h-full w-full flex-none rounded-lg bg-gray-2', className)}
        ref={forwardedRef}
      />
    </Suspense>
  )
})
