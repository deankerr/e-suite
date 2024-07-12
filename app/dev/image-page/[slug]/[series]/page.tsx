'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton, Separator } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import Link from 'next/link'

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
        <div className="flex h-12 w-full shrink-0 items-center border-b px-2">
          <div className="flex items-center gap-1 text-lg font-semibold tracking-tight">
            <Logo className="size-7" /> e/suite
          </div>

          <Separator orientation="vertical" size="2" ml="2" mr="2" />

          <CommandMenu
            button={
              <IconButton variant="ghost" size="1" className="shrink-0">
                <Icons.List className="size-7" />
              </IconButton>
            }
          />

          <Separator orientation="vertical" size="2" ml="2" mr="2" />

          <div className="flex items-center gap-1 text-sm font-medium md:text-base">
            <Icons.ImagesSquare className="size-5 shrink-0" />
            {thread.title}
          </div>

          <div className="flex grow items-center justify-end gap-2 px-4">
            <Link href={`/dev/image-page/${thread.slug}/${message.series - 1}`}>
              <Button variant="surface">
                <Icons.ArrowLeft size={24} />
              </Button>
            </Link>

            <Link href={`/dev/image-page/${thread.slug}/${message.series + 1}`}>
              <Button variant="surface">
                <Icons.ArrowRight size={24} />
              </Button>
            </Link>
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
