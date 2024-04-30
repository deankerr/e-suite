import { Label as RadixLabel } from '@radix-ui/react-label'

import { cn } from '@/lib/utils'

export const Label = ({
  className,
  ...props
}: Partial<React.ComponentProps<typeof RadixLabel>>) => {
  return <RadixLabel className={cn('text-xs', className)} {...props} />
}
