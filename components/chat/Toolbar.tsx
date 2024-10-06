'use client'

import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { useDebounceValue } from 'usehooks-ts'

import { useThread } from '@/app/lib/api/threads'
import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { Button } from '@/components/ui/Button'
import { PanelToolbar } from '@/components/ui/Panel'
import { SearchField } from '../ui/SearchField'
import { threadSearchTextAtom } from './atoms'

export const Toolbar = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId ?? '')
  const [searchTextValue, setSearchTextValue] = useAtom(threadSearchTextAtom)
  const [localValue, setLocalValue] = useDebounceValue(searchTextValue, 300, {
    maxWait: 1000,
  })

  useEffect(() => {
    setSearchTextValue(localValue)
  }, [localValue, setSearchTextValue])

  if (!thread) return null
  return (
    <PanelToolbar>
      <TextEditorDialog slug={thread.slug}>
        <Button variant="soft" color="gray" size="1">
          Instructions
        </Button>
      </TextEditorDialog>

      <div className="grow" />

      <SearchField onValueChange={setLocalValue} />
    </PanelToolbar>
  )
}
