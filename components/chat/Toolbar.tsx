'use client'

import { useThread, useThreadTextSearchQueryParams } from '@/app/lib/api/threads'
import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { Button } from '@/components/ui/Button'
import { PanelToolbar } from '@/components/ui/Panel'
import { SearchField } from '../ui/SearchField'

export const Toolbar = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId ?? '')
  const {
    search: [searchTextValue, setSearchTextValue],
  } = useThreadTextSearchQueryParams()

  if (!thread) return null
  return (
    <PanelToolbar>
      <TextEditorDialog slug={thread.slug}>
        <Button variant="soft" color="gray" size="1">
          Instructions
        </Button>
      </TextEditorDialog>

      <div className="grow" />

      <SearchField value={searchTextValue} onValueChange={setSearchTextValue} />
    </PanelToolbar>
  )
}
