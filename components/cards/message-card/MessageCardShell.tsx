import { Card, Inset } from '@radix-ui/themes'
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
    <Card {...props} className={cn('w-full', className)}>
      <Inset side="top">
        <div className="h-8 gap-1.5 border-b bg-gray-2 px-2 flex-between">
          {/* element button */}
          <IconComponent className="-mb-0.5 size-4 flex-none text-accent-11" />

          {/* title */}
          <div className="-mb-0.5 grow truncate text-sm font-medium capitalize">{title}</div>

          {/* controls */}
          <div className="flex-none gap-1.5 flex-end">{controls}</div>
        </div>
      </Inset>

      {children}
    </Card>
  )
}
