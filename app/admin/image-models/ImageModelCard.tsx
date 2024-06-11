import { Card } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

import type { EImageModel } from '@/convex/shared/shape'

export const ImageModelCard = ({
  model,
  className,
  ...props
}: { model: EImageModel } & React.ComponentProps<'div'>) => {
  return (
    <Card {...props} className={cn('h-48 w-80 rounded-lg border', className)}>
      <div className="text-sm font-medium text-gray-11">{model.creatorName}</div>
      <div className="text-base font-medium">{model.name}</div>
      <div className="font-mono text-xs text-gray-11">{model.model}</div>
    </Card>
  )
}
