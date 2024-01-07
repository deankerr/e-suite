'use client'

import { api } from '@/convex/_generated/api'
import { Button, TextArea } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useState } from 'react'

type CommandBarProps = {
  props?: any
}

export const CommandBar = ({ props }: CommandBarProps) => {
  const sendGeneration = useMutation(api.generations.send)

  const [positivePrompt, setPositivePrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')

  return (
    <div className="relative bottom-4 mx-auto max-w-[90vw] self-end rounded border border-gray-8 bg-background p-2 transition-all">
      <form
        className="flex items-end gap-2"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={async (e) => {
          e.preventDefault()
          await sendGeneration({
            prompt: positivePrompt,
            negative_prompt: negativePrompt,
            size: '',
            model: '',
          })
          setPositivePrompt('')
          setNegativePrompt('')
        }}
      >
        <TextArea
          placeholder="Positive prompt"
          size="3"
          className="h-full w-72 grow"
          value={positivePrompt}
          onChange={(e) => setPositivePrompt(e.target.value)}
        />
        <TextArea
          placeholder="Negative prompt"
          size="3"
          className="h-full w-72 grow"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
        />
        <Button variant="surface" size="4" type="submit">
          Go!
        </Button>
      </form>
    </div>
  )
}
