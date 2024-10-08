import { ScrollArea } from '@radix-ui/themes'

import { cn, twx } from '@/app/lib/utils'

export const VScrollArea = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ScrollArea>) => {
  return (
    <ScrollArea
      scrollbars="vertical"
      className={cn('grow [&>div>div]:max-w-full', className)}
      {...props}
    >
      {children}
    </ScrollArea>
  )
}

export const ScrollAreaVertical = twx(ScrollArea).attrs({
  scrollbars: 'vertical',
})`grow [&>div>div]:max-w-full`
