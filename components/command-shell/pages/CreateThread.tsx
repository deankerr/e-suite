'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, Dialog, IconButton, Select } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'

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
import { createThreadShellOpenAtom } from '@/lib/atoms'
import { useChatModels, useImageModels } from '@/lib/queries'

const CreateChat = () => {
  const chatModels = useChatModels()
  const [promptValue, setPromptValue] = useState('')

  const [modelKey, setModelKey] = useState('openrouter::perplexity/llama-3-sonar-large-32k-online')
  const currentModel = chatModels?.find((m) => m.resourceKey === modelKey)

  const [page, setPage] = useState<'form' | 'modelSelect'>('form')
  return (
    <div className="flex h-full max-h-[55vh] flex-col sm:max-h-none">
      {/* * header * */}
      <div className="flex h-12 shrink-0 items-center gap-1 truncate border-b border-grayA-3 px-2 font-medium">
        {/* <AppLogoName /> */}
        <Icons.CaretRight className="size-5 text-accentA-11" /> New Chat
        <div className="grow"></div>
        <IconButton variant="ghost" color="gray" className="m-0 shrink-0">
          <Icons.X className="size-5" />
        </IconButton>
      </div>

      {/* * form *  */}
      {page === 'form' && (
        <div className="">
          <div className="px-2 pt-1">
            <TextareaAutosize
              placeholder="Prompt..."
              className="border-none bg-transparent focus-visible:outline-none focus-visible:outline-transparent"
              rows={4}
              minRows={4}
              value={promptValue}
              onValueChange={(value) => setPromptValue(value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  // void run()
                }
              }}
            />
          </div>

          {/* * config * */}
          <div className="flex-start flex-wrap gap-2 px-2.5 pb-2 pt-1">
            <Button variant="surface" color="gray" onClick={() => setPage('modelSelect')}>
              <Icons.CodesandboxLogo className="size-4" />
              {currentModel?.name ?? modelKey}
            </Button>
          </div>

          {/* * actions * */}
          <div className="flex-start gap-2 border-t border-grayA-3 px-3 py-3">
            <Button variant="soft" color="gold">
              <Icons.Chat className="size-4" /> Chat
            </Button>

            <div className="grow"></div>

            <Button color="gray">Add</Button>

            <Button>
              Run
              <div className="hidden rounded bg-grayA-5 p-0.5 md:flex">
                <Icons.Command />
                <Icons.ArrowElbowDownLeft />
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* * model select cmdk * */}
      {page === 'modelSelect' && (
        <Cmdk>
          <CmdkInput placeholder="Search chat models..." className="border-b border-grayA-3" />
          <CmdkList>
            <CmdkEmpty>No results found.</CmdkEmpty>
            <CmdkGroup heading="Chat Models">
              {chatModels?.map((model) => (
                <CmdkItem
                  key={model._id}
                  value={`${model.name} ${model.endpoint}`}
                  onSelect={() => {
                    setModelKey(model.resourceKey)
                    setPage('form')
                  }}
                >
                  {model.name}
                </CmdkItem>
              ))}
            </CmdkGroup>
          </CmdkList>
        </Cmdk>
      )}
    </div>
  )
}

const CreateGeneration = () => {
  const imageModels = useImageModels()
  const [promptValue, setPromptValue] = useState('')

  const [modelKey, setModelKey] = useState('fal::fal-ai/pixart-sigma')
  const currentModel = imageModels?.find((m) => m.resourceKey === modelKey)

  const [page, setPage] = useState<'form' | 'modelSelect'>('form')
  return (
    <div className="flex h-full max-h-[55vh] flex-col sm:max-h-none">
      {/* * header * */}
      <div className="flex h-12 shrink-0 items-center gap-1 truncate border-b border-grayA-3 px-2 font-medium">
        {/* <AppLogoName /> */}
        <Icons.CaretRight className="size-5 text-accentA-11" /> New Generation
        <div className="grow"></div>
        <IconButton variant="ghost" color="gray" className="m-0 shrink-0">
          <Icons.X className="size-5" />
        </IconButton>
      </div>

      {/* * form *  */}
      {page === 'form' && (
        <div className="">
          <div className="px-2 pt-1">
            <TextareaAutosize
              placeholder="Prompt..."
              className="border-none bg-transparent focus-visible:outline-none focus-visible:outline-transparent"
              rows={4}
              minRows={4}
              value={promptValue}
              onValueChange={(value) => setPromptValue(value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  // void run()
                }
              }}
            />
          </div>

          {/* * config * */}
          <div className="flex-start flex-wrap gap-2 px-2.5 pb-2 pt-1">
            <Button variant="surface" color="bronze" onClick={() => setPage('modelSelect')}>
              <Icons.CodesandboxLogo className="size-4" />
              {currentModel?.name ?? modelKey}
            </Button>

            <Select.Root defaultValue="4">
              <Select.Trigger placeholder="Quantity" className="min-w-32" />
              <Select.Content>
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

            <Select.Root defaultValue="square">
              <Select.Trigger placeholder="Dimensions" className="min-w-32" />
              <Select.Content>
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
          </div>

          {/* * actions * */}
          <div className="flex-start gap-2 border-t border-grayA-3 px-3 py-3">
            <Button variant="soft" color="gold">
              <Icons.Image className="size-4" /> Generate
            </Button>

            <div className="grow"></div>

            <Button color="gray">Add</Button>
            <Button>
              Run
              <div className="hidden rounded bg-grayA-5 p-0.5 md:flex">
                <Icons.Command />
                <Icons.ArrowElbowDownLeft />
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* * model select cmdk * */}
      {page === 'modelSelect' && (
        <Cmdk>
          <CmdkInput placeholder="Search image models..." className="border-b border-grayA-3" />
          <CmdkList>
            <CmdkEmpty>No results found.</CmdkEmpty>
            <CmdkGroup heading="Image Models">
              {imageModels?.map((model) => (
                <CmdkItem
                  key={model._id}
                  value={`${model.name} ${model.endpoint}`}
                  onSelect={() => {
                    setModelKey(model.resourceKey)
                    setPage('form')
                  }}
                >
                  {model.name}
                </CmdkItem>
              ))}
            </CmdkGroup>
          </CmdkList>
        </Cmdk>
      )}
    </div>
  )
}

const CreateThreadDialog = ({
  triggerKey,
  children,
}: {
  triggerKey: string
  children?: React.ReactNode
}) => {
  const [open, setOpen] = useAtom(createThreadShellOpenAtom)

  useKeyboardEvent(triggerKey, (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      setOpen(!open)
    }
  })

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content
        align="start"
        maxWidth="42rem"
        className="rounded-md p-0"
        aria-describedby={undefined}
      >
        <Dialog.Title className="sr-only">Command Menu</Dialog.Title>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const CreateThreadShell = () => {
  return (
    <CreateThreadDialog triggerKey="j">
      {/* <CreateChat /> */}
      <CreateGeneration />
    </CreateThreadDialog>
  )
}
