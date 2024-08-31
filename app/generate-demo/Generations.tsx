'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Accordion from '@radix-ui/react-accordion'
import { Badge } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'
import NextImage from 'next/image'

import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'
import { IconButton } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { api } from '@/convex/_generated/api'

const statusColor = {
  queued: 'yellow',
  active: 'blue',
  done: 'green',
  failed: 'red',
} as const

const statusIcon = {
  queued: <Icons.CircleDashed size={18} />,
  active: <Icons.CircleNotch size={18} className="animate-spin" />,
  done: <Icons.Check size={18} />,
  failed: <Icons.WarningOctagon size={18} />,
} as const

export const Generations = () => {
  const generations = usePaginatedQuery(api.db.generations.list, {}, { initialNumItems: 10 })

  return (
    <Section className="overflow-y-auto border-none bg-transparent px-1">
      <div className="flex flex-col gap-4">
        {generations.results.map((gen) => (
          // => generation
          <div key={gen._id} className="divide-y rounded border bg-gray-1">
            {/* > header */}
            <div className="flex-start h-10 gap-2 px-1 pl-2 text-sm">
              <Badge color={statusColor[gen.status]} size="2">
                {statusIcon[gen.status]}
                {gen.status}
              </Badge>

              <div className="text-xs text-gray-11" suppressHydrationWarning>
                {new Date(gen._creationTime).toLocaleString()}
              </div>
              <div className="grow" />
              <IconButton variant="ghost" color="red" aria-label="Delete">
                <Icons.Trash size={18} />
              </IconButton>
            </div>

            {/* > details */}
            <div className="min-h-10 space-y-2 p-2 text-sm">
              <p>{gen.input?.prompt}</p>
              <div className="flex flex-wrap gap-1">
                <Badge>{gen.input?.modelId}</Badge>
                <Badge>{gen.input?.size}</Badge>
                <Badge>
                  <Icons.ImageSquare />
                  {gen.input?.n}
                </Badge>
              </div>
            </div>

            {/* > images */}
            <div className="flex min-h-32 flex-wrap gap-2 p-2">
              {gen.images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square w-64 overflow-hidden"
                  style={{ backgroundColor: image.color + '30' }}
                >
                  <NextImage
                    alt=""
                    src={image.fileUrl ?? ''}
                    placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
                    blurDataURL={image?.blurDataUrl}
                    width={image.width}
                    height={image.height}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}

              {gen.status !== 'failed' &&
                [...Array(Math.max(0, (gen.input?.n ?? 0) - gen.images.length))].map((_, i) => (
                  <div key={i} className="aspect-square w-64 overflow-hidden">
                    <ImageGeneratingEffect />
                  </div>
                ))}

              {gen.errors?.map((error, index) => (
                <pre
                  key={index}
                  className="h-fit text-wrap rounded border border-red-7 bg-red-4 p-2 text-xs text-red-12"
                >
                  {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
                </pre>
              ))}
            </div>

            {/* > add. details */}
            <Accordion.Root type="single" collapsible>
              <Accordion.Item value="gen-details" className="divide-y divide-gray-4">
                <Accordion.Trigger className="group flex-between w-full p-2 text-sm font-medium text-gray-11 outline-accentA-8 transition-colors hover:text-gray-12">
                  Details
                  <Icons.CaretDown
                    size={18}
                    className="transition-transform duration-300 group-data-[state=open]:rotate-180"
                  />
                </Accordion.Trigger>
                <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                  <div className="p-2">
                    <pre className="max-h-64 overflow-y-auto text-wrap font-mono text-xs">
                      {JSON.stringify({ ...gen, images: undefined }, null, 2)}
                      {JSON.stringify(gen.images, null, 2)}
                    </pre>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        ))}
      </div>
    </Section>
  )
}
