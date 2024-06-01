import { useState } from 'react'
import { Button } from '@radix-ui/themes'
import { toast } from 'sonner'

import { Textarea } from '@/components/ui/Textarea'
import { useEditMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EMessageWithContent } from '@/convex/shared/structures'

type MessageTextEditorProps = {
  message: EMessageWithContent
  onClose: () => void
} & React.ComponentProps<'div'>

export const MessageTextEditor = ({
  message,
  onClose,
  className,
  ...props
}: MessageTextEditorProps) => {
  const editMessage = useEditMessage()
  const [text, setText] = useState(message.content ?? '')

  const handleSaveMessage = () => {
    editMessage({ messageId: message._id, text, role: message.role })
      .then(() => {
        toast.success('Message saved')
        onClose()
      })
      .catch((err) => {
        console.error(err)
        toast.error('An error occurred')
      })
  }
  return (
    <div {...props} className={cn('', className)}>
      <div className="font-mono text-xs text-gray-11">text editor</div>
      <div className="space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="message text..."
          className={cn('text-wrap rounded-lg bg-gray-1 p-2 font-mono text-sm text-gray-12')}
        />
        <div className="gap-2 flex-end">
          <Button variant="soft" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveMessage}>Save</Button>
        </div>
      </div>
    </div>
  )
}
