import { Card, IconButton, Inset } from '@radix-ui/themes'
import { MessageSquareIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { LucideIcon } from 'lucide-react'

type MessageCardShellProps = {
  title?: string
  icon?: LucideIcon
  controls?: React.ReactNode
} & React.ComponentProps<typeof Card>

export const MessageCardShell = ({
  title = 'Card title',
  icon = MessageSquareIcon,
  controls,
  className,
  children,
  ...props
}: MessageCardShellProps) => {
  const IconComponent = icon

  return (
    <Card {...props} className={cn('', className)}>
      <Inset side="top">
        <div className="h-8 gap-1 border-b bg-gray-2 px-2 flex-between">
          {/* element button */}
          <IconButton variant="ghost" size="1" className="pointer-events-none flex-none">
            <IconComponent className="size-4" />
          </IconButton>

          {/* title */}
          <div className="grow truncate text-sm font-semibold capitalize">{title}</div>

          {/* controls */}
          <div className="flex-none gap-1.5 flex-end">{controls}</div>
        </div>
      </Inset>

      {children}
    </Card>
  )
}
