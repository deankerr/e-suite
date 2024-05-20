import { useState } from 'react'
import { Label } from '@radix-ui/react-label'
import { Button, TextField } from '@radix-ui/themes'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'sonner'

import { SelectList } from '@/components/ui/SelectList'
import { useEditMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/shared/schemas'

type MessageEditorProps = { message: EMessage } & React.ComponentProps<'div'>

export const MessageEditor = ({ message, className, ...props }: MessageEditorProps) => {
  const send = useEditMessage()

  const [role, setRole] = useState<string>(message.role)
  const [name, setName] = useState(message.name || '')
  const [text, setText] = useState(message.content || '')

  const handleSaveMessage = () => {
    send({ messageId: message._id, role: role as 'user' | 'assistant' | 'system', name, text })
      .then(() => {
        toast.success('Message saved')
      })
      .catch((err) => {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Unknown error')
      })
  }

  return (
    <div {...props} className={cn('', className)}>
      <div className="flex items-end gap-3 px-1 py-2">
        <Label className="font-mono text-xs">
          <span className="sr-only">role</span>
          <SelectList
            items={['user', 'assistant', 'system']}
            value={role}
            onValueChange={setRole}
          />
        </Label>

        <Label className="font-mono text-xs">
          <span className="sr-only">name</span>
          <TextField.Root
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
          />
        </Label>

        <div className="grow" />

        <Button variant="surface" color="grass" onClick={handleSaveMessage}>
          save
        </Button>
      </div>

      <TextareaAutosize
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message content..."
        className={cn(
          'w-full resize-none text-wrap rounded-lg border border-transparent bg-gray-1 p-2 font-mono text-sm text-gray-12 outline-none placeholder:text-gray-9',
        )}
      />
    </div>
  )
}
