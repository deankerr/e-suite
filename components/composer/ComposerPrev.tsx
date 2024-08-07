import { useMemo, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label } from '@radix-ui/react-label'
import { Button, Select } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { RectangleHorizontal } from '@/components/icons/RectangleHorizontal'
import { RectangleVertical } from '@/components/icons/RectangleVertical'
import { useShellActions } from '@/components/shell/hooks'
import { Badge } from '@/components/ui/Badge'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { appConfig } from '@/config/config'
import { defaultRunConfigChat } from '@/convex/shared/defaults'
import { getMaxQuantityForModel } from '@/convex/shared/helpers'
import { useChatModels, useImageModels, useThreadActions } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { RunConfigChat, RunConfigTextToImage, ThreadActionResult } from '@/convex/types'

export const ComposerPrev = ({
  initialRunConfig,
  onModelChange,
  textareaMinRows = 2,
  threadId,
  className,
  ...props
}: {
  initialRunConfig?: RunConfigChat | RunConfigTextToImage
  onModelChange?: () => void
  textareaMinRows?: number
  threadId?: string
} & React.ComponentProps<'form'>) => {
  const chatModels = useChatModels()
  const imageModels = useImageModels()
  const threadActions = useThreadActions(threadId)
  const shell = useShellActions()
  const router = useRouter()

  const chatConfig = initialRunConfig?.type === 'chat' ? initialRunConfig : null
  const textToImageConfig = initialRunConfig?.type === 'textToImage' ? initialRunConfig : null
  const currentConfig = chatConfig ?? textToImageConfig ?? defaultRunConfigChat
  const currentResourceKey = currentConfig.resourceKey

  const currentModel = useMemo(() => {
    if (currentResourceKey) {
      return (
        chatModels?.find((model) => model.resourceKey === currentResourceKey) ??
        imageModels?.find((model) => model.resourceKey === currentResourceKey)
      )
    }
    return null
  }, [currentResourceKey, chatModels, imageModels])

  const [promptValue, setPromptValue] = useState('')

  const maxQuantity = getMaxQuantityForModel(textToImageConfig?.resourceKey ?? '')
  const [textToImageN, setTextToImageN] = useState(maxQuantity)

  const [textToImageSize, setTextToImageSize] = useState<'square' | 'portrait' | 'landscape'>(
    textToImageConfig?.size ?? 'square',
  )

  const handleActionResult = (result?: ThreadActionResult | null) => {
    if (result) setPromptValue('')
    if (result && result.threadId !== threadId) {
      shell.close()
      router.push(`${appConfig.threadUrl}/${result.slug}`)
    }
  }

  const send = () => {
    if (!chatConfig && !textToImageConfig) {
      toast.error('Invalid configuration')
      return
    }

    if (chatConfig && promptValue) {
      threadActions
        .append({
          message: {
            role: 'user',
            text: promptValue,
          },
          runConfig: chatConfig,
        })
        .then(handleActionResult)
    } else if (textToImageConfig) {
      threadActions
        .run({
          runConfig: textToImageConfig,
        })
        .then(handleActionResult)
    }
  }

  const add = () => {
    threadActions
      .append({
        message: {
          role: 'user',
          text: promptValue,
        },
      })
      .then(handleActionResult)
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
          {currentModel?.name ?? 'No Model Selected'}
          {onModelChange && <Icons.CaretUpDown className="phosphor" />}
        </Button>

        {currentModel && (
          <>
            <div className="flex-start gap-1">
              <Badge size="3" color="brown">
                {currentModel.endpoint}
              </Badge>

              {currentModel.moderated && (
                <Badge size="3" color="ruby">
                  moderated
                </Badge>
              )}

              {currentModel.type === 'image' && currentModel.architecture && (
                <Badge size="3" color="brown">
                  {currentModel.architecture}
                </Badge>
              )}
            </div>
          </>
        )}

        {textToImageConfig && (
          <>
            <QuantitySelect
              value={textToImageN.toString()}
              onValueChange={(value) => setTextToImageN(Number(value))}
              max={maxQuantity}
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

const QuantitySelect = ({
  max,
  ...props
}: { max: number } & React.ComponentProps<typeof Select.Root>) => {
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
          <Select.Item value="2" disabled={max < 2}>
            <div className="flex items-center gap-1">
              <Icons.Copy className="size-5 shrink-0 -scale-75" />
              Double
            </div>
          </Select.Item>

          <Select.Item value="4" className="items-center" disabled={max < 4}>
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
