'use client'

import { forwardRef } from 'react'
import { Select } from '@radix-ui/themes'
import { useAtom } from 'jotai'

import { Label } from '@/components/ui/Label'
import togetheraiModels from './togetheraiModels.json'

import type { TextInputAtom } from './useThread'

type Props = {
  inputAtom: TextInputAtom
}

export const ModelSelect = forwardRef<
  HTMLButtonElement,
  Props & React.ComponentProps<typeof Select.Root>
>(function ModelSelect({ inputAtom, ...props }, forwardedRef) {
  const [value, setValue] = useAtom(inputAtom.atom)
  const { label, name } = inputAtom
  const textModels = togetheraiModels

  return (
    <div className="flex flex-col gap-1 p-3">
      <Label htmlFor={name}>{label}</Label>

      <Select.Root value={value} onValueChange={(v) => setValue(v)}>
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
