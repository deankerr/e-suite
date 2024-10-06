'use client'

import { useThread } from '@/app/lib/api/threads'
import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { Button } from '@/components/ui/Button'
import { PanelToolbar } from '@/components/ui/Panel'

export const Toolbar = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId ?? '')

  if (!thread) return null
  return (
    <PanelToolbar>
      <TextEditorDialog slug={thread.slug}>
        <Button variant="soft" color="gray" size="1">
          Instructions
        </Button>
      </TextEditorDialog>

      <div className="grow" />
    </PanelToolbar>
  )
}
