'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { ScrollArea } from '@radix-ui/themes'
import { usePathname, useRouter } from 'next/navigation'

import { Message } from '@/components/message/Message'
import { PageWrapper } from '@/components/pages/PageWrapper'
import { IconButton } from '@/components/ui/Button'
import { Link } from '@/components/ui/Link'
import { useMessageInt } from '@/lib/api'

export const MessageDetailPage = ({ slug, mNum }: { slug: string; mNum: number }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { thread, message } = useMessageInt(slug, mNum)

  const [__, suite, threads, threadSlug, msg] = pathname.split('/')
  if (!msg) return null

  if (thread === null) return null
  if (message === null) return <PageWrapper empty />
  if (!thread || !message) return <PageWrapper loading />

  const backUrl = pathname.split('/').slice(0, -1).join('/')

  return (
    <PageWrapper>
      <div className="grid h-full grid-rows-[3rem_1fr_3rem] overflow-hidden bg-gray-3">
        <div className="flex-between border-b border-grayA-3 px-2 font-medium">
          <IconButton variant="ghost" color="gray" aria-label="More options" disabled>
            <Icons.DotsNine size={20} />
          </IconButton>

          <div>Message Detail</div>

          <div className="flex-end gap-1">
            <Link href={backUrl}>Back</Link>
            <IconButton variant="ghost" aria-label="Close" onClick={() => router.push(backUrl)}>
              <Icons.X size={20} />
            </IconButton>
          </div>
        </div>

        <div className="overflow-hidden bg-gray-2">
          <ScrollArea scrollbars="vertical">
            <div className="w-full overflow-x-hidden px-2 text-sm">
              <Message message={message} hideTimeline />
            </div>
          </ScrollArea>
        </div>

        <div className="flex-center border-t border-grayA-3 px-2">Footer</div>
      </div>
    </PageWrapper>
  )
}
