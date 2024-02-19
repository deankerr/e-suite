'use client'

import { Label } from '@/app/components/ui/Label'
import { Select } from '@radix-ui/themes'
import { forwardRef } from 'react'
import { TextInputData, useThreadsAtom } from './threads.store'
import togetheraiModels from './togetheraiModels.json'

type Props = {
  label: string
  inputData: TextInputData
}

export const ModelSelect = forwardRef<
  HTMLButtonElement,
  Props & React.ComponentProps<typeof Select.Root>
>(function ModelSelect({ label, inputData, ...props }, forwardedRef) {
  const [value, setValue] = useThreadsAtom(inputData)
  const { name } = inputData

  const textModels = togetheraiModels

  return (
    <div className="flex flex-col gap-1 p-3">
      <Label htmlFor={name}>{label}</Label>

      <Select.Root value={value as string} onValueChange={(v) => setValue(v)}>
        <Select.Trigger {...props} placeholder="Select a model" ref={forwardedRef} />
        <Select.Content>
          <Select.Group>
            <Select.Label>Chat</Select.Label>
            {textModels.chat.map((model) => (
              <Select.Item key={model.reference} value={model.reference}>
                {model.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  )
})
