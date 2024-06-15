import { Badge, Card, Inset } from '@radix-ui/themes'
import Image from 'next/image'

import { EndpointBadge } from '@/app/admin/Badges'
import { cn } from '@/lib/utils'

import type { EImageModel } from '@/convex/shared/shape'

export const ImageModelCard = ({
  model,
  className,
  ...props
}: { model: EImageModel } & React.ComponentProps<'div'>) => {
  return (
    <Card {...props} className={cn('flex h-64 w-40 shrink-0 flex-col', className)}>
      <Inset side="top" className="absolute inset-0">
        {model.coverImageUrl && (
          <Image
            src={model.coverImageUrl}
            alt={`${model.name} cover image`}
            className="h-full w-full object-cover object-top"
            fill
            sizes="13rem"
            draggable={false}
          />
        )}
      </Inset>

      <div className={cn('absolute inset-x-2 top-2 gap-2 rounded flex-between')}>
        <Badge color="orange" variant="surface" className="bg-black/75">
          {model.architecture}
        </Badge>
        <EndpointBadge endpoint={model.endpoint} variant="surface" className="bg-black/75" />
      </div>

      <Inset
        side="bottom"
        className="absolute inset-x-1 bottom-2 min-h-16 space-y-1 bg-black/75 px-3 py-3 text-center flex-col-center"
      >
        <div className="text-sm font-medium">{model.name}</div>
      </Inset>
    </Card>
  )
}
