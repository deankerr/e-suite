import { useState } from 'react'
import { Dialog } from '@radix-ui/themes'

import { CmdK } from '@/components/command/CmdK'
import { ModelLogo } from '@/components/icons/ModelLogo'
import { useModels } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EChatModel, EImageModel } from '@/convex/types'

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
        <CmdK tabIndex={0} className="bg-gray-2">
          <CmdK.Input placeholder="Search models..." />
          <CmdK.List>
            <CmdK.Empty>No models found</CmdK.Empty>

            {model && (
              <CmdK.Group heading="Current">
                <ModelItem
                  key={model.resourceKey}
                  value={`current ${model.resourceKey}`}
                  onSelect={() => handleSelect(model.resourceKey)}
                  model={model}
                />
              </CmdK.Group>
            )}

            {showChatModels && (
              <CmdK.Group heading="Chat Models">
                {chatModels?.map((model) => (
                  <ModelItem
                    key={model.resourceKey}
                    value={model.resourceKey}
                    onSelect={() => handleSelect(model.resourceKey)}
                    model={model}
                  />
                ))}
              </CmdK.Group>
            )}

            {showImageModels && (
              <CmdK.Group heading="Image Models">
                {imageModels?.map((model) => (
                  <ModelItem
                    key={model.resourceKey}
                    value={model.resourceKey}
                    onSelect={() => handleSelect(model.resourceKey)}
                    model={model}
                  />
                ))}
              </CmdK.Group>
            )}
          </CmdK.List>
        </CmdK>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const ModelItem = ({
  model,
  className,
  ...props
}: { model: EChatModel | EImageModel } & React.ComponentProps<typeof CmdK.Item>) => {
  return (
    <CmdK.Item {...props} className={cn('font-medium aria-selected:text-orange-11', className)}>
      <div className="mr-2 shrink-0">
        <ModelLogo modelName={model.name} size={20} />
      </div>
      <div className="truncate">{model.name}</div>
      <div className="ml-auto shrink-0 text-xs text-gray-11">{model.endpoint}</div>
    </CmdK.Item>
  )
}
