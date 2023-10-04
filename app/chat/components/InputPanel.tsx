'use client'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

type Props = {
  handleSubmit: (content: string) => void
}

export function InputPanel({ handleSubmit }: Props) {
  const [message, setMessage] = useState('')

  return (
    <div className="fixed bottom-0 flex w-full max-w-md justify-center rounded-md bg-base-300 px-4 py-2">
      <form
        className="flex w-full justify-center gap-4 align-middle"
        onSubmit={(e) => {
          e.preventDefault()
          console.log('inputpanel submit:', message)
          handleSubmit(message)
        }}
      >
        <textarea
          className="font textarea textarea-accent textarea-sm flex-auto"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
