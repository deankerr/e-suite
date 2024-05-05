import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

type HomePanelProps = { name: string } & React.ComponentProps<'div'>

export const HomePanel = forwardRef<HTMLDivElement, HomePanelProps>(function HomePanel(
  { name, className, ...props },
  forwardedRef,
) {
  return (
    <div
      {...props}
      className={cn('h-full border-2 border-cyan-6 bg-cyan-2 transition-all', className)}
      ref={forwardedRef}
    >
      <p>{name}</p>
    </div>
  )
})
