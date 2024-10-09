import { useState } from 'react'

import { cn } from '@/app/lib/utils'
import { Button } from '../ui/Button'
import { TextareaAutosize } from '../ui/TextareaAutosize'
import { useMessageContext } from './MessageProvider'

export const MessageEditor = () => {
  const { message, updateMessageText, textStyle } = useMessageContext()
  const [textValue, setTextValue] = useState(message?.text ?? '')

  const handleSave = () => {
    updateMessageText(textValue)
  }

  return (
    <>
      <TextareaAutosize
        name="content"
        className={cn('border-none bg-transparent p-0')}
        value={textValue}
        onValueChange={setTextValue}
        autoFocus
      />
      <div>
        <Button variant="ghost" onClick={handleSave}>
          Save
        </Button>
      </div>
    </>
  )
}
