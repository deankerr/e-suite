'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton, Separator } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

import { CommandMenu } from '@/components/command-menu/CommandMenu'
import { GenerationPage } from '@/components/pages/GenerationPage'
import { Logo } from '@/components/ui/Logo'
import { Pre } from '@/components/util/Pre'
import { api } from '@/convex/_generated/api'
import { getTextToImageConfig } from '@/convex/shared/utils'

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
          <div className="flex items-center gap-1 text-lg font-semibold tracking-tight">
            <Logo className="size-7" /> e/suite
          </div>

          <Separator orientation="vertical" size="2" mx="1" />
          <CommandMenu
            button={
              <IconButton variant="ghost" size="1" className="shrink-0">
                <Icons.List className="size-7" />
              </IconButton>
            }
          />
          <Separator orientation="vertical" size="2" mx="1" />

          <div className="flex items-center gap-1 font-medium">
            <Icons.ImagesSquare className="size-5" />
            {thread.title}
          </div>
        </div>
        <div className="h-[calc(100%-3rem)]">
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
