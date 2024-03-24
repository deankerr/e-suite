'use client'

import { cn } from '@/lib/utils'

type SidebarProps = {
  left?: boolean
  right?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
} & React.ComponentProps<'div'>

export const Sidebar = ({
  left,
  right,
  open,
  onOpenChange = () => {},
  className,
  children,
  ...props
}: SidebarProps) => {
  // const isSmallDevice = useMediaQuery('only screen and (max-width : 520px)')
  const isSmallDevice = false

  return (
    <>
      {/* spacer */}
      {!isSmallDevice && open ? <div className={cn('h-full w-80 shrink-0')}></div> : null}

      {/* overlay */}
      {isSmallDevice && open ? (
        <div className="absolute inset-0 z-20 bg-overlay" onClick={() => onOpenChange(false)}></div>
      ) : null}

      {/* content */}
      <div
        {...props}
        className={cn(
          'absolute z-20 flex h-full w-80 translate-x-0 flex-col bg-gray-1 transition-transform duration-500',
          left && 'border-r',
          right && 'right-0 border-l',
          !open && left && '-translate-x-full',
          !open && right && 'translate-x-full',
          className,
        )}
      >
        {children}
      </div>
    </>
  )
}
