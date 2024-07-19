import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label } from '@radix-ui/react-label'
import { Button, Select } from '@radix-ui/themes'

import { type ShellHelpers } from '@/components/command-shell/useCommandShell'
import { RectangleHorizontal, RectangleVertical } from '@/components/ui/Icons'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'
import { cn } from '@/lib/utils'

export const ThreadComposer = ({
  shell,
  className,
  ...props
}: {
  shell: ShellHelpers
} & React.ComponentProps<'form'>) => {
  const [promptValue, setPromptValue] = useState('')

  const send = () => {
    if (!shell.currentModel) {
      return
    }

    shell.createThread({
      text: promptValue,
      run:
        shell.inferenceType === 'chat'
          ? {
              type: 'chat',
              resourceKey: shell.currentModel?.resourceKey,
            }
          : {
              type: 'textToImage',
              prompt: promptValue,
              resourceKey: shell.currentModel?.resourceKey,
              n: 4,
              size: 'square',
            },
    })
  }

  return (
    <form className={cn('shrink-0', className)}>
      {/* * prompt * */}
      <Label className="block px-2">
        <span className="sr-only">Prompt</span>
        <TextareaAutosize
          name="prompt"
          placeholder="Prompt..."
          className="border-none bg-transparent focus-visible:outline-none focus-visible:outline-transparent"
          rows={4}
          minRows={4}
          value={promptValue}
          onValueChange={(value) => setPromptValue(value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              send()
            }
          }}
        />
      </Label>

      {/* * config * */}
      <div className="flex gap-1.5 px-3 py-1.5">
        <Button
          type="button"
          variant="surface"
          color="bronze"
          onClick={() => shell.push('ModelSelect')}
        >
          <Icons.CodesandboxLogo className="size-4" />
          {shell.currentModel?.name ?? shell.currentModel?.resourceKey ?? '???'}
        </Button>

        {shell.inferenceType === 'textToImage' && (
          <>
            <QuantitySelect />
            <DimensionsSelect />
          </>
        )}
      </div>

      {/* * actions * */}
      <div className="flex gap-2 border-t border-grayA-3 p-3">
        {shell.inferenceType === 'chat' && (
          <Button
            type="button"
            variant="surface"
            color="gold"
            onClick={() => shell.setInferenceType('textToImage')}
          >
            <Icons.Chat className="size-4" />
            Chat
          </Button>
        )}

        {shell.inferenceType === 'textToImage' && (
          <Button
            type="button"
            variant="surface"
            color="gold"
            onClick={() => shell.setInferenceType('chat')}
          >
            <Icons.ImageSquare className="size-4" />
            Text To Image
          </Button>
        )}

        <div className="grow"></div>

        <Button type="button" color="gray">
          Add
        </Button>
        <Button type="button" onClick={send}>
          Run
          <div className="hidden rounded bg-grayA-5 p-0.5 md:flex">
            <Icons.Command />
            <Icons.ArrowElbowDownLeft />
          </div>
        </Button>
      </div>
    </form>
  )
}

const QuantitySelect = () => {
  return (
    <Select.Root defaultValue="4">
      <Select.Trigger placeholder="Quantity" className="min-w-24" variant="soft" color="gray" />
      <Select.Content variant="soft">
        <Select.Group>
          <Select.Label>Quantity</Select.Label>
          <Select.Item value="1">
            <div className="flex items-center gap-1">
              <Icons.Stop className="size-5 shrink-0 -scale-75" />
              Single
            </div>
          </Select.Item>
          <Select.Item value="4" className="items-center">
            <div className="flex items-center gap-1">
              <Icons.GridFour className="size-5 shrink-0" />
              Grid
            </div>
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}

const DimensionsSelect = () => {
  return (
    <Select.Root defaultValue="square">
      <Select.Trigger placeholder="Dimensions" className="min-w-24" variant="soft" color="gray" />
      <Select.Content variant="soft" highContrast>
        <Select.Group>
          <Select.Label>Dimensions</Select.Label>
          <Select.Item value="portrait">
            <div className="flex items-center gap-1">
              <RectangleVertical className="size-4 shrink-0" />
              Portrait
            </div>
          </Select.Item>
          <Select.Item value="square" className="items-center">
            <div className="flex items-center gap-1">
              <Icons.Square className="size-4 shrink-0" />
              Square
            </div>
          </Select.Item>
          <Select.Item value="landscape">
            <div className="flex items-center gap-1">
              <RectangleHorizontal className="size-4 shrink-0" />
              Landscape
            </div>
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}
