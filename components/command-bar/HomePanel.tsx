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
      id="home"
      className={cn('h-full w-full border-2', className)}
      ref={forwardedRef}
    >
      <p>{name}</p>
    </div>
  )
})
