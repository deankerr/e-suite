import { cn } from '@/lib/utils'

const variant = {
  left: 'left-sidebar left-0 border-r',
  right: 'right-sidebar right-0 md:left-0 place-self-end border-l',
} as const

type SidebarProps = {
  children?: React.ReactNode
  className?: TailwindClass
  side: 'left' | 'right'
}

export const Sidebar = ({ children, className, side }: SidebarProps) => {
  return (
    <div
      className={cn(
        'relative z-20 h-full w-80 flex-none overflow-hidden border-gray-6 bg-background transition-all duration-300',
        variant[side],
      )}
    >
      <div className={cn('flex h-full flex-col p-3', className)}>{children}</div>
    </div>
  )
}
