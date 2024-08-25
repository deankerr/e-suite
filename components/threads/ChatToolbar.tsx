'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'

import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { Button } from '@/components/ui/Button'
import { SkeletonShimmer } from '@/components/ui/Skeleton'
import { useThread } from '@/lib/api'
import { twx } from '@/lib/utils'

export const ChatToolbar = ({ thread_id }: { thread_id: string }) => {
  const thread = useThread(thread_id ?? '')

  if (thread === undefined) {
    return (
      <ChatToolbarWrapper>
        <SkeletonShimmer />
      </ChatToolbarWrapper>
    )
  }

  if (thread === null) {
    return (
      <ChatToolbarWrapper>
        <Icons.Question size={20} className="text-grayA-11" />
      </ChatToolbarWrapper>
    )
  }

  return (
    <ChatToolbarWrapper>
      <TextEditorDialog slug={thread.slug}>
        <Button variant="soft" color="gray" size="1">
          Instructions
        </Button>
      </TextEditorDialog>
    </ChatToolbarWrapper>
  )
}

const ChatToolbarWrapper = twx.div`flex-start h-10 border-b border-gray-5 w-full gap-1 px-1 text-sm`
