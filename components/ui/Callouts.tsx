import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Callout } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

export const ErrorCallout = ({
  title,
  message,
  className,
}: {
  title: string
  message: string
  className?: string
}) => {
  return (
    <Callout.Root color="red" role="alert" className={cn('mx-auto max-w-2xl', className)}>
      <Callout.Icon>
        <Icons.WarningOctagon className="animate-pulse" />
      </Callout.Icon>
      <Callout.Text className="border-b border-red-6 pb-1">{title}</Callout.Text>
      <Callout.Text className="">{message}</Callout.Text>
    </Callout.Root>
  )
}
