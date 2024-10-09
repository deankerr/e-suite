import { useState } from 'react'

import { Button } from '../ui/Button'
import { TextareaAutosize } from '../ui/TextareaAutosize'
import { useMessageContext } from './MessageProvider'

export const MessageEditor = () => {
  const { message, updateMessageText } = useMessageContext()
  const [textValue, setTextValue] = useState(message?.text ?? '')

  const handleSave = () => {
    updateMessageText(textValue)
  }

  return (
    <div className="overflow-y-auto text-gray-11 placeholder:text-grayA-10">
      <TextareaAutosize
        name="content"
        className="sm:monospace overflow-x-auto whitespace-pre-wrap border-none p-4 font-mono text-gray-11"
        value={textValue}
        onValueChange={setTextValue}
        autoFocus
      />
      <div>
        <Button variant="ghost" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
