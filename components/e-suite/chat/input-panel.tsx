'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { useEffect, useRef, useState } from 'react'

type Props = {}

export function ChatInputPanel(props: Props) {
  const [input, setInput] = useState<string>('')

  const formRef = useRef<HTMLFormElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  //* auto-resize textarea on change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + 'px'
    }
  }, [input])

  return (
    <form
      className="flex items-end"
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault()
        console.log('submit', e)
      }}
    >
      <Textarea
        className="inline-flex min-h-0 resize-none overflow-y-hidden rounded-none"
        ref={textareaRef}
        placeholder="Enter your message..."
        name="chat message input"
        required={true}
        value={input}
        rows={1}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey && formRef.current) {
            e.preventDefault()
            console.log('enter submit')
            formRef.current.requestSubmit()
          }
        }}
      />
      <Button size="icon" className="rounded-none">
        <PaperPlaneIcon />
      </Button>
    </form>
  )
}
