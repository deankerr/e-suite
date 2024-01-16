import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/themes'

const variant = {
  left: 'left-sidebar left-0 border-r shadow-[30px_0px_60px_-12px_rgba(0,0,0,0.9)]',
  right:
    'right-sidebar right-0 place-self-end border-l shadow-[-30px_0px_60px_-12px_rgba(0,0,0,0.9)]',
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
        'relative z-20 h-full w-96 overflow-hidden border-gray-6 bg-background transition-all duration-300',
        variant[side],
      )}
    >
      <ScrollArea className="h-full" type="hover" scrollbars="vertical">
        <div className={cn('flex h-full flex-col justify-center p-3', className)}>{children}</div>
      </ScrollArea>
    </div>
  )
}
