import { IconButton } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

import { useInputBarAtom } from '@/components/input-bar/atoms'
import { useSendMessage } from '@/components/input-bar/useSendMessage'

export const MessageInput = () => {
  const [inputBar, setInputBar] = useInputBarAtom()
  const sendMessage = useSendMessage()

  return (
    <div className="flex items-end gap-2">
      <TextareaAutosize
        maxRows={10}
        placeholder="A bird in the bush is worth..."
        className="w-full resize-none bg-transparent p-1 text-gray-12 outline-none placeholder:text-gray-9"
        value={inputBar.prompt}
        onChange={(e) => setInputBar((o) => ({ ...o, prompt: e.target.value }))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void sendMessage()
          }
        }}
      />
      <div className="h-9 flex-end">
        <IconButton variant="ghost" size="2" onClick={() => void sendMessage()}>
          <SendHorizonalIcon />
        </IconButton>
      </div>
    </div>
  )
}
