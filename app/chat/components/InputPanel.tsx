'use client'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { ChatRequestOptions } from 'ai'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'

type Props = {
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined,
  ) => void
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void
  input: string
}

export function InputPanel({ handleSubmit, handleInputChange, input }: Props) {
  // auto-resize textarea on change
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + 'px'
    }
  }, [input])

  return (
    <div className="flex w-full justify-center rounded-md bg-base-200 px-4 py-2">
      <form
        className="flex w-full justify-center gap-4 align-middle"
        onSubmit={(e) => handleSubmit(e)}
      >
        <textarea
          className="font textarea textarea-accent textarea-md flex-auto text-base"
          placeholder="Enter your message..."
          value={input}
          onChange={(e) => handleInputChange(e)}
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
