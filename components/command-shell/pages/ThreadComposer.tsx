import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label } from '@radix-ui/react-label'
import { Button, Dialog, IconButton, Select } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'

import { useModelsApi } from '@/app/b/_providers/ModelsApiProvider'
import { useCreateThread } from '@/app/b/api'
import {
  Cmdk,
  CmdkEmpty,
  CmdkGroup,
  CmdkInput,
  CmdkItem,
  CmdkList,
} from '@/components/command-shell/components/Cmdk'
import { RectangleHorizontal, RectangleVertical } from '@/components/ui/Icons'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'
import { createThreadShellOpenAtom } from '@/lib/atoms'
import { cn } from '@/lib/utils'

export const ThreadComposer = ({
  inferenceType = 'chat',
  className,
  ...props
}: { inferenceType?: 'chat' | 'textToImage' } & React.ComponentProps<'form'>) => {
  const createThread = useCreateThread()
  const { chatModels, imageModels } = useModelsApi()
  const models = inferenceType === 'chat' ? chatModels : imageModels

  const [promptValue, setPromptValue] = useState('')
  const [modelKey, setModelKey] = useState(
    inferenceType === 'chat'
      ? defaultChatInferenceConfig.resourceKey.toLowerCase()
      : defaultImageInferenceConfig.resourceKey,
  )
  const currentModel = models?.find((model) => model.resourceKey === modelKey)

  const send = () => {
    createThread({
      text: promptValue,
      run:
        inferenceType === 'chat'
          ? {
              type: 'chat',
              resourceKey: modelKey,
            }
          : {
              type: 'textToImage',
              prompt: promptValue,
              resourceKey: modelKey,
              n: 4,
              size: 'square',
            },
    })
  }

  return (
    <form {...props} className={cn('shrink-0', className)}>
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
        <Button type="button" variant="surface" color="bronze">
          <Icons.CodesandboxLogo className="size-4" />
          {currentModel?.name ?? currentModel?.resourceKey ?? '???'}
        </Button>

        {inferenceType === 'textToImage' && (
          <>
            <QuantitySelect />
            <DimensionsSelect />
          </>
        )}
      </div>

      {/* * actions * */}
      <div className="flex gap-2 border-t border-grayA-3 p-3">
        {inferenceType === 'chat' && (
          <Button type="button" variant="surface" color="gold">
            <Icons.Chat className="size-4" />
            Chat
          </Button>
        )}

        {inferenceType === 'textToImage' && (
          <Button type="button" variant="surface" color="gold">
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

// * temp shell set up

const ShellOuter = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="flex h-full max-h-[55vh] flex-col sm:max-h-none">
      {/* * header * */}
      <div className="flex h-12 shrink-0 items-center gap-1 truncate border-b border-grayA-3 px-2 font-medium">
        {/* <AppLogoName /> */}
        <Icons.CaretRight className="size-5 text-accentA-11" /> {title}
        <div className="grow"></div>
        <IconButton variant="ghost" color="gray" className="m-0 shrink-0">
          <Icons.X className="size-5" />
        </IconButton>
      </div>

      {children}
    </div>
  )
}

export const CreateChatThreadShell = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton variant="ghost" color="gray" className="m-0 shrink-0">
          <Icons.Chat className="size-5" />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content
        align="start"
        maxWidth="42rem"
        className="rounded-md p-0"
        aria-describedby={undefined}
      >
        <Dialog.Title className="sr-only">Command Menu</Dialog.Title>
        <ShellOuter title="New Chat">
          <ThreadComposer inferenceType="chat" />
        </ShellOuter>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const CreateImageThreadShell = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton variant="ghost" color="gray" className="m-0 shrink-0">
          <Icons.ImageSquare className="size-5" />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content
        align="start"
        maxWidth="42rem"
        className="rounded-md p-0"
        aria-describedby={undefined}
      >
        <Dialog.Title className="sr-only">Command Menu</Dialog.Title>
        <ShellOuter title="New Image">
          <ThreadComposer inferenceType="textToImage" />
        </ShellOuter>
      </Dialog.Content>
    </Dialog.Root>
  )
}
