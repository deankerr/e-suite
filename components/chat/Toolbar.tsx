'use client'

import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { Button } from '@/components/ui/Button'
import { SectionToolbar } from '@/components/ui/Section'
import { useThread } from '@/lib/api'

export const Toolbar = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId ?? '')

  if (!thread) return null
  return (
    <SectionToolbar>
      <TextEditorDialog slug={thread.slug}>
        <Button variant="soft" color="gray" size="1">
          Instructions
        </Button>
      </TextEditorDialog>
    </SectionToolbar>
  )
}
