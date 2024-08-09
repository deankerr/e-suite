import { useState } from 'react'
import { Dialog } from '@radix-ui/themes'

import { CmdK } from '@/components/command/CmdK'
import { useModels } from '@/lib/api'

export const ModelPickerCmd = ({
  type,
  value,
  onValueChange,
  children,
}: {
  type?: 'chat' | 'image'
  value: string
  onValueChange: (value: string) => unknown
  children?: React.ReactNode
}) => {
  const { chatModels, imageModels, model } = useModels(value)
  const modelSet = model?.type ?? type
  const showChatModels = modelSet === 'chat' || !modelSet
  const showImageModels = modelSet === 'image' || !modelSet

  const [open, setOpen] = useState(false)
  const handleSelect = (value: string) => {
    onValueChange(value)
    setOpen(false)
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content
        align="start"
        maxWidth="42rem"
        className="rounded-md p-0"
        aria-describedby={undefined}
      >
        <Dialog.Title className="sr-only">Model Picker</Dialog.Title>
        <CmdK tabIndex={0}>
          <CmdK.Input placeholder="Search models..." />
          <CmdK.List>
            <CmdK.Empty>No models found</CmdK.Empty>

            {model && (
              <CmdK.Group heading="Current">
                <CmdK.Item
                  value={`current ${model.resourceKey}`}
                  onSelect={() => handleSelect(model.resourceKey)}
                >
                  {model.name}
                </CmdK.Item>
              </CmdK.Group>
            )}

            {showChatModels && (
              <CmdK.Group heading="Chat Models">
                {chatModels?.map((model) => (
                  <CmdK.Item
                    key={model.resourceKey}
                    value={model.resourceKey}
                    onSelect={() => handleSelect(model.resourceKey)}
                  >
                    {model.name}
                  </CmdK.Item>
                ))}
              </CmdK.Group>
            )}

            {showImageModels && (
              <CmdK.Group heading="Image Models">
                {imageModels?.map((model) => (
                  <CmdK.Item
                    key={model.resourceKey}
                    value={model.resourceKey}
                    onSelect={() => handleSelect(model.resourceKey)}
                  >
                    {model.name}
                  </CmdK.Item>
                ))}
              </CmdK.Group>
            )}
          </CmdK.List>
        </CmdK>
      </Dialog.Content>
    </Dialog.Root>
  )
}
