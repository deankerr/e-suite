'use client'

import { Card } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

import { ImageModelCardH } from '@/components/cards/ImageModelCard'
import { EImageLoader } from '@/components/images/EImageLoader'
import { GenerationPage } from '@/components/pages/GenerationPage'
import { Logo } from '@/components/ui/Logo'
import { Pre } from '@/components/util/Pre'
import { api } from '@/convex/_generated/api'
import { getTextToImageConfig } from '@/convex/shared/utils'
import { useImageModel } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { EMessage, EThread, TextToImageConfig } from '@/convex/types'

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
      <div className="fixed flex h-svh w-full flex-col">
        <div className="flex h-12 w-full shrink-0 items-center gap-2 border-b px-2">
          <div className="flex items-center gap-0.5 text-lg font-semibold tracking-tight">
            <Logo className="size-8" /> e/suite
          </div>

          {/* spacer dot */}
          <div className="h-8 w-0.5 bg-grayA-6" />

          <div className="">{thread.title}</div>
        </div>
        <div className="h-[calc(100%-3rem)]">
          {/* <div className="h-full w-full overflow-hidden"> */}
          <GenerationPage
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
