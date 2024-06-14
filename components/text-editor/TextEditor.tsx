import { useMemo } from 'react'
import { BaseEditor } from 'slate'
import { Editable, ReactEditor, Slate } from 'slate-react'

import { deserialize, serialize } from '@/components/text-editor/utils'
import { ClientOnly } from '@/components/util/ClientOnly'
import { cn } from '@/lib/utils'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const TextEditorComponent = ({
  storageKey = 'text-editor',
  editor,
  className,
  ...props
}: { storageKey?: string; editor: BaseEditor & ReactEditor } & React.ComponentProps<
  typeof Editable
>) => {
  const initialValue = useMemo(
    () => deserialize(localStorage.getItem(storageKey) || ''),
    [storageKey],
  )

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type)
        if (isAstChange) {
          localStorage.setItem(storageKey, serialize(value))
        }
      }}
    >
      <Editable
        {...props}
        className={cn(
          'rounded border border-gray-7 bg-gray-1 p-2 focus:outline-accent-8',
          className,
        )}
      />
    </Slate>
  )
}

export const TextEditor = (props: React.ComponentProps<typeof TextEditorComponent>) => {
  return (
    <ClientOnly>
      <TextEditorComponent {...props} />
    </ClientOnly>
  )
}
