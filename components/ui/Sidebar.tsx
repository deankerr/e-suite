import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

type SidebarProps = {
  side: 'left' | 'right'
  open?: boolean
  onOpenChange?: (open: boolean) => void
} & React.ComponentProps<'div'>

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  { side, open, onOpenChange, children, className, ...props },
  forwardedRef,
) {
  const overlayCn =
    'w-full md:z-10 pointer-events-auto z-40 bg-overlay md:bg-transparent md:pointer-events-none md:w-80'

  return (
    // container / overlay
    <div
      {...props}
      className={cn(
        'pointer-events-none absolute bottom-0 top-0 z-10 w-80',
        side === 'left' ? 'left-0' : 'right-0',
        open && overlayCn,
        className,
      )}
      ref={forwardedRef}
      onClick={() => onOpenChange && onOpenChange(false)}
    >
      {/* main */}
      <div
        className={cn(
          'pointer-events-auto absolute bottom-0 top-0 z-50 w-80 border-gold-5 bg-gray-1 transition-transform',
          side === 'left' ? '-translate-x-full border-r' : 'right-0 translate-x-full border-l',
          open && 'translate-x-0',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
})
