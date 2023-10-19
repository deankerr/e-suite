'use client'

import { Button } from '@/components/ui/button'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { UseChatHelpers } from 'ai/react'
import { useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

type Props = {
  chatHelpers: UseChatHelpers
}

export function MessageTextInput({ chatHelpers }: Props) {
  const { input, handleSubmit, handleInputChange } = chatHelpers
  const formRef = useRef<HTMLFormElement | null>(null)

  const isValidInput = !!input.trim()

  return (
    <form id="e-chat-input-panel" className="px-2 py-1" ref={formRef} onSubmit={handleSubmit}>
      <div className="relative w-full">
        <TextareaAutosize
          className="w-full resize-none rounded-3xl border bg-transparent py-3 pl-6 pr-16 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Enter your message..."
          name="Enter your message"
          rows={1}
          required={true}
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey && formRef.current) {
              e.preventDefault()
              formRef.current.requestSubmit()
            }
          }}
        />

        <Button
          className="absolute bottom-3 right-1.5 h-10 rounded-3xl"
          variant={isValidInput ? 'default' : 'outline'}
          type="submit"
        >
          <PaperPlaneIcon />
        </Button>
      </div>
    </form>
  )
}
