import { useState } from 'react'
import { Label } from '@radix-ui/react-label'
import { Button, Select } from '@radix-ui/themes'
import { toast } from 'sonner'

import { useUpdateMessage } from '@/app/lib/api/threads'
import { cn } from '@/app/lib/utils'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { TextField } from '@/components/ui/TextField'
import { EMessage } from '@/convex/types'

import type { FormEvent } from 'react'

export const MessageEditorV1 = ({
  message,
  onClose,
  className,
  ...props
}: { message: EMessage; onClose: () => unknown } & React.ComponentProps<'form'>) => {
  const updateMessage = useUpdateMessage()
  const [isPending, setIsPending] = useState(false)

  const [roleValue, setRoleValue] = useState<string>(message.role)
  const [nameValue, setNameValue] = useState(message.name)
  const [textValue, setTextValue] = useState(message.text)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    try {
      await updateMessage({
        messageId: message._id,
        role: roleValue as EMessage['role'],
        name: nameValue,
        text: textValue,
      })
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update message')
    }

    setIsPending(false)
  }

  return (
    <form {...props} className={cn('space-y-2', className)} onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Label className="block text-xs font-medium">
          role
          <Select.Root
            size={{ initial: '3', sm: '2' }}
            name="role"
            value={roleValue}
            onValueChange={setRoleValue}
          >
            <Select.Trigger className="flex w-40 font-mono" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Role</Select.Label>
                <Select.Item value="user" className="font-mono">
                  user
                </Select.Item>
                <Select.Item value="assistant" className="font-mono">
                  assistant
                </Select.Item>
                <Select.Item value="system" className="font-mono">
                  system
                </Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Label>

        <Label className="block text-xs font-medium">
          name
          <TextField
            size={{ initial: '3', sm: '2' }}
            name="name"
            value={nameValue}
            onValueChange={setNameValue}
            className="w-40"
          />
        </Label>
      </div>

      <Label className="block text-xs font-medium">
        content
        <TextareaAutosize
          name="content"
          className="overflow-hidden bg-gray-1 font-mono text-base md:text-sm"
          value={textValue}
          onValueChange={setTextValue}
        />
      </Label>

      <div className="flex-end gap-2">
        <Button variant="soft" color="gray" type="button" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="solid" type="submit" loading={isPending}>
          Save
        </Button>
      </div>
    </form>
  )
}
