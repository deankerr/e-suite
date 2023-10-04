'use client'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'

type Props = {
  handleSubmit: (content: string) => void
}

export function InputPanel({ handleSubmit }: Props) {
  const [message, setMessage] = useState('')

  // auto-resize textarea on change
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + 'px'
    }
  }, [message])

  return (
    <div className="flex w-full max-w-md justify-center rounded-md bg-base-200 px-4 py-2">
      <form
        className="flex w-full justify-center gap-4 align-middle"
        onSubmit={(e) => {
          e.preventDefault()
          console.log('inputpanel submit:', message)
          handleSubmit(message)
        }}
      >
        <textarea
          className="font textarea textarea-accent textarea-md flex-auto text-base"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          ref={textareaRef}
        />

        <div className="flex flex-col justify-center">
          <button className="btn btn-circle btn-accent" type="submit">
            <PaperAirplaneIcon className="ml-1 w-8" />
          </button>
        </div>
      </form>
    </div>
  )
}
