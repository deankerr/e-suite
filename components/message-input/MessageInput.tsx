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
import { getWidthHeightForEndpoint } from '@/lib/utils'
import { DimensionsControl } from './DimensionsControl'
import { QuantityControl } from './QuantityControl'

import type { ETextToImageInference } from '@/convex/shared/structures'

export const MessageInput = () => {
  const { sendMessage, runInference, updateThreadConfig, thread } = useChat()
  const storageKey = `prompt-editor-${thread?.slug || ''}`

  const handleSendMessage = async () => {
    if (!thread) return
    const prompt = getEditorStorageText(storageKey)
    if (!prompt) return console.warn('prompt is empty')

    if (thread.config.ui.type === 'chat-completion') {
      await sendMessage({
        message: { content: prompt },
        inference: thread.config.ui,
      })
      resetEditorValue()
    }

    if (thread.config.ui.type === 'text-to-image') {
      await runInference({
        inference: { ...thread.config.ui, prompt },
      })
      resetEditorValue()
    }
  }

  const handleUpdateTTIConfig = async (parameters: Partial<ETextToImageInference>) => {
    if (thread?.config.ui.type !== 'text-to-image') return
    await updateThreadConfig({
      config: {
        ...thread.config,
        ui: {
          ...thread.config.ui,
          ...parameters,
        },
      },
    })
  }

  const [editor] = useState(() => withReact(createEditor()))
  const resetEditorValue = () => {
    removeEditorStorageText(storageKey)
    editor.children = deserialize('')
    editor.onChange()
  }

  if (!thread) return null
  return (
    <div className="flex w-full shrink-0 flex-col justify-center gap-2 px-5 pb-2">
      {thread && <TextEditor storageKey={storageKey} editor={editor} />}

      <div className="shrink-0 gap-2 flex-between">
        <div className="shrink-0 gap-2 flex-start">
          <Button color="gray" variant="soft" disabled>
            User
          </Button>
        </div>

        {thread.config.ui.type === 'text-to-image' && (
          <div className="shrink-0 gap-2 flex-between">
            <QuantityControl
              n={thread.config.ui.n}
              onValueChange={(n) => void handleUpdateTTIConfig({ n: Number(n) })}
            />
            <DimensionsControl
              width={thread.config.ui.width}
              height={thread.config.ui.height}
              onValueChange={async (size: string) => {
                const { width, height } = getWidthHeightForEndpoint(size, thread.config.ui.endpoint)
                void handleUpdateTTIConfig({ width, height })
              }}
            />
          </div>
        )}

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
