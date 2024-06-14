import { useState } from 'react'
import { Button } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'

import { useChat } from '@/components/chat/ChatProvider'
import { TextEditor } from '@/components/text-editor/TextEditor'
import {
  deserialize,
  getEditorStorageText,
  removeEditorStorageText,
} from '@/components/text-editor/utils'
import { cn, getThreadConfig } from '@/lib/utils'

export const MessageInput = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { sendMessage, thread } = useChat()
  const storageKey = `prompt-editor-${thread?.slug || ''}`

  const { chatCompletion } = getThreadConfig(thread)

  const handleSendMessage = async () => {
    const prompt = getEditorStorageText(storageKey)
    if (!prompt) return console.warn('prompt is empty')

    if (chatCompletion) {
      await sendMessage({
        message: { content: prompt },
        inference: chatCompletion,
      })
      resetEditorValue()
    }
  }

  const [editor] = useState(() => withReact(createEditor()))
  const resetEditorValue = () => {
    removeEditorStorageText(storageKey)
    editor.children = deserialize('')
    editor.onChange()
  }

  return (
    <div {...props} className={cn('flex w-full flex-col justify-center gap-2', className)}>
      {thread && <TextEditor storageKey={storageKey} editor={editor} />}

      <div className="shrink-0 gap-2 flex-between">
        <div className="shrink-0 gap-2 flex-start">
          <Button color="gray" variant="soft">
            User
          </Button>

          <Button color="gray" variant="soft" onClick={resetEditorValue}>
            Clear
          </Button>
        </div>

        <div className="shrink-0 gap-2 flex-end">
          <Button color="gray">Add</Button>
          <Button onClick={handleSendMessage}>
            Send
            <SendHorizonalIcon className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
