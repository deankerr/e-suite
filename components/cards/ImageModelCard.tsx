import { Card, Inset } from '@radix-ui/themes'
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
    <Card {...props} className={cn('flex h-72 w-48 shrink-0 flex-col', className)}>
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

      <div className={cn('absolute right-2 top-2 rounded bg-surface')}>
        <EndpointBadge endpoint={model.endpoint} variant="surface" size="2" className="block" />
      </div>

      <Inset
        side="bottom"
        className="absolute inset-x-1 bottom-2 min-h-16 space-y-1 bg-black/75 px-3 py-3 text-center flex-col-center"
      >
        <div className="text-base font-semibold">{model.name}</div>
      </Inset>
    </Card>
  )
}
