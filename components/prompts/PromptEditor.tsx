import { useRef, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'

import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Button } from '@/components/ui/Button'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { twx } from '@/lib/utils'
import { MDXEditor } from '../mdx-editor/MDXEditor'

import type { MDXEditorMethods } from '@mdxeditor/editor'

const TextFieldGhost = twx.input`flex outline-none disabled:cursor-not-allowed disabled:opacity-50 w-full text-base 
  font-normal text-gray-12 placeholder:text-grayA-10 sm:text-sm`

export const PromptEditor = ({
  initialTitle,
  initialContent,
  onSave,
}: {
  initialTitle: string
  initialContent: string
  onSave: (args: { title: string; content: string }) => void
}) => {
  const ref = useRef<MDXEditorMethods>(null)

  const [titleValue, setTitleValue] = useState(initialTitle)
  const [textValue, setTextValue] = useState(initialContent)

  return (
    <Panel>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href="/prompts" className="shrink-0">
          Prompt Editor
        </PanelTitle>
        <Icons.CaretRight size={18} className="mx-1 shrink-0 text-grayA-10" />
        <TextFieldGhost
          placeholder="Untitled Prompt"
          id="prompt-title"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
        />
        <Button variant="surface" onClick={() => onSave({ title: titleValue, content: textValue })}>
          Save
        </Button>
      </PanelHeader>
      <div className="grow">
        <MDXEditor
          ref={ref}
          markdown={textValue}
          onChange={setTextValue}
          className="markdown-body"
          autoFocus
        />
      </div>
    </Panel>
  )
}
