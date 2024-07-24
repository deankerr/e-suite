import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label } from '@radix-ui/react-label'
import { Button, Select } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useShellActions } from '@/components/shell/hooks'
import { Badge } from '@/components/ui/Badge'
import { RectangleHorizontal, RectangleVertical } from '@/components/ui/Icons'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { appConfig } from '@/config/config'
import { useThreadActions } from '@/lib/api'
import { cn, getInferenceConfig } from '@/lib/utils'

import type { api } from '@/convex/_generated/api'
import type { EChatModel, EImageModel, InferenceConfig } from '@/convex/types'
import type { FunctionReturnType } from 'convex/server'

export const Composer = ({
  runConfig,
  model,
  onSuccess,
  onModelChange,
  textareaMinRows = 2,
  threadId,
  className,
  ...props
}: {
  runConfig: InferenceConfig
  model: EChatModel | EImageModel | null | undefined
  onSuccess?: (result: FunctionReturnType<typeof api.db.threadsB.append>) => void
  onModelChange?: () => void
  textareaMinRows?: number
  threadId?: string
} & React.ComponentProps<'form'>) => {
  // TODO refactor duplicate configs/responsibilities
  const { chatConfig, textToImageConfig } = getInferenceConfig(runConfig)
  const threadActions = useThreadActions(threadId)
  const shell = useShellActions()
  const router = useRouter()

  const [promptValue, setPromptValue] = useState('')
  const [textToImageN, setTextToImageN] = useState<'1' | '4'>(
    textToImageConfig?.n === 1 ? '1' : '4',
  )
  const [textToImageSize, setTextToImageSize] = useState<'square' | 'portrait' | 'landscape'>(
    textToImageConfig?.size ?? 'square',
  )

  const handleActionResult = (
    result: FunctionReturnType<typeof api.db.runcreate.append> | null,
  ) => {
    if (result && result.threadId !== threadId) {
      shell.close()
      router.push(`${appConfig.chatUrl}/${result.slug}`)
    }
  }

  const send = () => {
    if (chatConfig) {
      async function sendChat() {
        if (!model) {
          toast.error('No model selected')
          return
        }

        const result = await threadActions.append({
          message: {
            role: 'user',
            text: promptValue,
          },
          runConfig: {
            type: 'chat',
            resourceKey: model.resourceKey,
          },
        })
        handleActionResult(result)
      }

      void sendChat()
    }

    if (textToImageConfig) {
      async function sendTextToImage() {
        if (!model) {
          toast.error('No model selected')
          return
        }

        const result = await threadActions.run({
          runConfig: {
            type: 'textToImage',
            resourceKey: model.resourceKey,
            prompt: promptValue,
            n: textToImageN === '1' ? 1 : 4,
            size: textToImageSize,
          },
        })
        handleActionResult(result)
      }
      void sendTextToImage()
    }
  }

  const add = () => {
    async function sendAddMessage() {
      const result = await threadActions.append({
        message: {
          role: 'user',
          text: promptValue,
        },
      })
      handleActionResult(result)
    }
    void sendAddMessage()
  }

  return (
    <form
      className={cn(
        'shrink-0',
        threadActions.state !== 'ready' && 'pointer-events-none opacity-50',
        className,
      )}
      {...props}
    >
      {/* * prompt * */}
      <Label className="block px-2">
        <span className="sr-only">Prompt</span>
        <TextareaAutosize
          name="prompt"
          placeholder={`${chatConfig ? 'Enter your message...' : 'Enter your prompt...'}`}
          className="border-none bg-transparent focus-visible:outline-none focus-visible:outline-transparent"
          rows={textareaMinRows}
          minRows={textareaMinRows}
          value={promptValue}
          onValueChange={(value) => setPromptValue(value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              send()
            }
          }}
          disabled={threadActions.state !== 'ready'}
          autoFocus
        />
      </Label>

      {/* * model / config * */}
      <div className="flex flex-wrap gap-2 px-2 pb-2 pt-1.5">
        <Button
          type="button"
          variant="surface"
          color="gray"
          highContrast
          disabled={threadActions.state === 'rateLimited'}
          onClick={() => onModelChange?.()}
        >
          <Icons.Cube className="size-4" />
          {model?.name ?? 'No Model Selected'}
          {onModelChange && <Icons.CaretUpDown className="phosphor" />}
        </Button>

        {model && (
          <>
            <div className="flex-start gap-1">
              <Badge size="3" color="brown">
                {model.endpoint}
              </Badge>

              {model.moderated && (
                <Badge size="3" color="ruby">
                  moderated
                </Badge>
              )}

              {model.type === 'image' && model.architecture && (
                <Badge size="3" color="brown">
                  {model.architecture}
                </Badge>
              )}
            </div>
          </>
        )}

        {textToImageConfig && (
          <>
            <QuantitySelect
              value={textToImageN}
              onValueChange={(value) => setTextToImageN(value as '1' | '4')}
              disabled={threadActions.state === 'rateLimited'}
            />
            <DimensionsSelect
              value={textToImageSize}
              onValueChange={(value) =>
                setTextToImageSize(value as 'portrait' | 'landscape' | 'square')
              }
              disabled={threadActions.state === 'rateLimited'}
            />
          </>
        )}
      </div>

      {/* * actions * */}
      <div className="flex gap-2 border-t border-grayA-3 px-2 py-3">
        <Button
          type="button"
          variant="soft"
          color="gold"
          highContrast
          disabled={threadActions.state === 'rateLimited'}
        >
          {chatConfig ? (
            <Icons.Chat className="phosphor" />
          ) : (
            <Icons.ImageSquare className="phosphor" />
          )}
          {chatConfig ? 'Chat' : 'Text To Image'}
        </Button>

        <div className="grow"></div>

        <Button
          type="button"
          color="gray"
          onClick={add}
          loading={threadActions.state === 'pending'}
          disabled={threadActions.state === 'rateLimited'}
        >
          Add
        </Button>
        <Button
          type="button"
          onClick={send}
          loading={threadActions.state === 'pending'}
          disabled={threadActions.state === 'rateLimited'}
        >
          Run
          <div className="md:hidden">
            <Icons.PaperPlane className="size-4" />
          </div>
          <div className="hidden rounded bg-grayA-5 p-0.5 md:flex">
            <Icons.Command />
            <Icons.ArrowElbowDownLeft />
          </div>
        </Button>
      </div>
    </form>
  )
}

const QuantitySelect = (props: React.ComponentProps<typeof Select.Root>) => {
  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder="Quantity" className="min-w-24" variant="soft" color="gray" />
      <Select.Content variant="soft" color="gray">
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

const DimensionsSelect = (props: React.ComponentProps<typeof Select.Root>) => {
  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder="Dimensions" className="min-w-24" variant="soft" color="gray" />
      <Select.Content variant="soft" color="gray">
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
