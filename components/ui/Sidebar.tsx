import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/themes'
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
    'w-full xl:z-10 pointer-events-auto z-40 bg-overlay xl:bg-transparent xl:pointer-events-none xl:w-80'

  return (
    // container / spacer / overlay
    <div
      {...props}
      className={cn(
        // xs - closed: inert, open: overlay
        // xl - closed: inert, open: static spacer
        'pointer-events-none absolute bottom-0 top-0 z-10 w-80 xl:static xl:translate-x-0',
        side === 'left' ? 'left-0' : 'right-0',
        open
          ? overlayCn
          : side === 'left'
            ? 'xl:absolute xl:-translate-x-full'
            : 'xl:absolute xl:translate-x-full',
        className,
      )}
      ref={forwardedRef}
      onClick={() => onOpenChange && onOpenChange(false)}
    >
      {/* scrollbar main */}
      <div
        className={cn(
          'pointer-events-auto absolute bottom-0 top-0 z-50 w-80 bg-gray-1 transition-transform',
          side === 'left' ? '-translate-x-full border-r' : 'right-0 translate-x-full border-l',
          open && 'translate-x-0',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ScrollArea>
          <div className="w-80 px-1.5">{children}</div>
        </ScrollArea>
      </div>
    </div>
  )
})
