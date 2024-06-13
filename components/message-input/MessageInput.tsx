import { useState } from 'react'
import { Button } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'
import { BaseEditor, createEditor } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'

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

const initialValue = [
  {
    type: 'paragraph' as const,
    children: [{ text: '' }],
  },
]

export const MessageInput = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <div {...props} className={cn('flex w-full flex-col justify-center gap-2', className)}>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className="min-h-16 rounded border border-gray-7 bg-gray-1 p-2 focus:outline-accent-8"
          disableDefaultStyles
        />
      </Slate>

      <div className="shrink-0 gap-2 flex-between">
        <div className="shrink-0 gap-2 flex-start">
          <Button color="gray" variant="soft">
            User
          </Button>
        </div>

        <div className="shrink-0 gap-2 flex-end">
          <Button color="gray">Add</Button>
          <Button>
            Send <SendHorizonalIcon className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
