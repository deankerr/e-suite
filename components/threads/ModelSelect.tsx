'use client'

import { Select } from '@radix-ui/themes'
import { forwardRef } from 'react'
import togetheraiModels from './togetheraiModels.json'

type Props = {
  onChange: (...event: any[]) => void
}

export const ModelSelect = forwardRef<
  HTMLButtonElement,
  Props & React.ComponentProps<typeof Select.Root>
>(function ModelSelect({ onChange, ...props }, forwardedRef) {
  const textModels = togetheraiModels

  return (
    <Select.Root
      {...props}
      onValueChange={(v) => {
        console.log(v)
        onChange(v)
      }}
    >
      <Select.Trigger placeholder="Select a model" ref={forwardedRef} />
      <Select.Content>
        <Select.Group>
          <Select.Label>Chat</Select.Label>
          {textModels.chat.map((model) => (
            <Select.Item key={model.reference} value={model.reference}>
              {model.name}
            </Select.Item>
          ))}
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Completion</Select.Label>
          {textModels.completion.map((model) => (
            <Select.Item key={model.reference} value={model.reference}>
              {model.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
})
