'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { ChatRequestOptions } from 'ai'
import { ChangeEvent, FormEvent, useEffect, useRef } from 'react'

type Props = {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined,
  ) => void
}

export function ChatInputPanel({ input, handleInputChange, handleSubmit }: Props) {
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
    <form className="flex items-end border-t-2 text-base" ref={formRef} onSubmit={handleSubmit}>
      <textarea
        className={cn(
          'min-h-0 w-full resize-none overflow-y-hidden px-3 py-2',
          'bg-transparent placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        ref={textareaRef}
        placeholder="Enter your message..."
        name="Enter your message"
        required={true}
        value={input}
        rows={1}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey && formRef.current) {
            e.preventDefault()
            formRef.current.requestSubmit()
          }
        }}
      />
      <Button className="h-10 w-16 rounded-none" type="submit">
        <PaperPlaneIcon />
      </Button>
    </form>
  )
}
