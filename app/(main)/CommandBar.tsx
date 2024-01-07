'use client'

import { api } from '@/convex/_generated/api'
import { Button, Select, TextArea } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useState } from 'react'

type CommandBarProps = {
  props?: any
}

export const CommandBar = ({ props }: CommandBarProps) => {
  const sendGeneration = useMutation(api.generations.send)

  const [positivePrompt, setPositivePrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('dall-e-2')

  return (
    <div className="relative bottom-0 mx-auto max-w-[90vw] self-end rounded border border-gray-8 bg-background p-2 transition-all">
      <form
        className="flex items-end gap-2"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={async (e) => {
          e.preventDefault()
          await sendGeneration({
            prompt: positivePrompt,
            negative_prompt: negativePrompt,
            size: '',
            model,
          })
          setPositivePrompt('')
          setNegativePrompt('')
        }}
      >
        <TextArea
          placeholder="Positive prompt"
          size="3"
          className=""
          value={positivePrompt}
          onChange={(e) => setPositivePrompt(e.target.value)}
        />
        <TextArea
          placeholder="Negative prompt"
          size="3"
          className=""
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
        />

        <Select.Root value={model} onValueChange={setModel}>
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Label>sinkin</Select.Label>
              <Select.Item value="4zdwGOB">DreamShaper</Select.Item>
              <Select.Item value="aLvMRnX">Aniverse</Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.Label>OpenAI</Select.Label>
              <Select.Item value="dall-e-2">DALL-E 2</Select.Item>
              <Select.Item value="dall-e-3">DALL-E 3</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>

        <Button variant="surface" size="4" type="submit">
          Go!
        </Button>
      </form>
    </div>
  )
}
