import { Card, Inset } from '@radix-ui/themes'
import NextImage from 'next/image'

import { useModelList } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { Temp_EModels } from '@/convex/models'

export const ModelCard = ({
  model: modelFromProps,
  resId,
  variant = 'mini',
  className,
  ...props
}: {
  model?: Temp_EModels[number]
  resId?: string
  variant?: 'nano' | 'mini'
} & Omit<React.ComponentProps<typeof Card>, 'variant'>) => {
  const modelList = useModelList(modelFromProps ? 'skip' : undefined)

  const model = modelFromProps || modelList?.find((model) => model.resId === resId)
  if (!model) return null

  const sizeCn = variant === 'nano' ? 'h-32 w-32' : 'h-60 w-40'
  return (
    <Card {...props} className={cn('h-60 w-40 flex-none p-0 @container/card', sizeCn, className)}>
      <div className={cn('flex h-full')}>
        <Inset side="top" className="absolute inset-0">
          <NextImage
            src={`/i/${model.image?._id}`}
            alt={model.name}
            sizes="160px"
            placeholder={model.image?.blurDataUrl ? 'blur' : 'empty'}
            blurDataURL={model.image?.blurDataUrl}
            className="h-full w-full object-cover object-top"
            fill
            draggable={false}
          />
        </Inset>

        <div className="mt-auto min-h-12 w-full bg-overlay px-0.5 py-2 text-center text-xs font-semibold flex-center @[10rem]:min-h-16 @[10rem]:text-sm">
          {model.name}
        </div>
      </div>
    </Card>
  )
}
