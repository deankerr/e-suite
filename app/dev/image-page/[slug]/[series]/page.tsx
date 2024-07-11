'use client'

import { Card, Inset } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

import { ImageModelCard, ImageModelCardH } from '@/components/cards/ImageModelCard'
import { EImageLoader } from '@/components/images/EImageLoader'
import { ImageBR } from '@/components/images/ImageBR'
import { Message } from '@/components/message/Message'
import { Pre } from '@/components/util/Pre'
import { api } from '@/convex/_generated/api'
import { getTextToImageConfig } from '@/convex/shared/utils'
import { useImageModel } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { EMessage, EThread, TextToImageConfig } from '@/convex/types'

// const slug = 'hc2dusga'
// const series = 21

export default function Page({ params }: { params: { slug: string; series: string } }) {
  const result = useQuery(api.db.messages.getSlugMessage, {
    slug: params.slug,
    series: Number(params.series),
  })

  if (!result || !result.message) {
    return (
      <div className="fixed flex h-svh w-full">
        <div className="m-auto">
          {result === null || result?.message === null ? <p>Error</p> : <p>Loading...</p>}
        </div>
      </div>
    )
  }

  const { thread, message } = result
  const textToImageConfig = getTextToImageConfig(message?.inference)

  if (textToImageConfig) {
    return (
      <div className="fixed flex h-svh w-full">
        {/* <div className="h-12 w-full shrink-0 border-b">e/suite</div> */}
        {/* <div className="h-[calc(100%-3rem)]"> */}
        <div className="h-full w-full overflow-hidden">
          <Generation
            thread={thread}
            message={message}
            textToImageConfig={textToImageConfig}
            className="gap-2 p-2"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed flex h-svh w-full">
      <div className="m-auto">
        <Pre>{JSON.stringify(message, null, 2)}</Pre>
      </div>
    </div>
  )
}

const Generation = ({
  thread,
  message,
  textToImageConfig,
  className,
  ...props
}: {
  thread: Omit<EThread, 'model'>
  message: EMessage
  textToImageConfig: TextToImageConfig
} & React.ComponentProps<'div'>) => {
  const imageModel = useImageModel({ resourceKey: textToImageConfig.resourceKey })

  return (
    <div
      {...props}
      className={cn(
        'h-full w-full space-y-4 overflow-y-auto md:grid md:grid-cols-[1fr_20rem] md:space-y-0',
        className,
      )}
    >
      {/* image grid */}
      <div className="grid max-h-full grid-cols-2 grid-rows-2 gap-2 self-start overflow-hidden">
        {message.images.map((image) => (
          <div key={image._id} className="[&_>_div]:odd:ml-auto">
            <div
              style={{ aspectRatio: image.width / image.height }}
              className="relative flex max-h-full flex-col overflow-hidden rounded-xl border"
            >
              <div className="absolute inset-x-0 top-0 z-10 bg-overlay p-2">title</div>
              <div className="relative flex-grow">
                <EImageLoader
                  key={image._id}
                  image={image}
                  className="absolute inset-0 rounded-lg"
                  priority
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 bg-overlay p-2">
                ({image.width}x{image.height}) - {image.captionText}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* details */}
      <div className="">
        <div className="mx-auto flex flex-col gap-4">
          {imageModel && <ImageModelCardH model={imageModel} className="mx-auto" />}

          <Card className="flex flex-col gap-2">
            <div className="text-lg font-medium">Generation Data</div>

            <div className="">
              <div className="text-sm font-medium text-gray-11">Prompt</div>
              <div>{textToImageConfig.prompt}</div>
            </div>

            <div className="">
              <div className="text-sm font-medium text-gray-11">Size</div>
              <div>
                {textToImageConfig.width}x{textToImageConfig.height} px
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
