import { Card, Inset } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

export const ChatShell = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Card>) => {
  return (
    <Card {...props} className={cn('grid h-full w-full', className)}>
      <Inset side="all" className="flex flex-col">
        {children}
      </Inset>
    </Card>
  )
}
