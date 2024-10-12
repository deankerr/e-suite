'use client'

import { memo, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import ReactTextareaAutosize from 'react-textarea-autosize'

import { useThreadActions } from '@/app/lib/api/actions'
import { useThread } from '@/app/lib/api/threads'
import { ModelPickerCmd } from '@/components/command/ModelPickerCmd'
import { ModelButton } from '@/components/composer/ModelButton'
import { Button, IconButton } from '@/components/ui/Button'

export type ComposerSend = (args: {
  text: string
  model: { provider: string; id: string }
  action: 'append' | 'run'
}) => Promise<unknown>

export const Composer = memo(({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const actions = useThreadActions(thread?._id ?? '')
  const loading = actions.state !== 'ready'

  const [resourceKey, setResourceKey] = useState(
    getModelKey(thread?.kvMetadata ?? {}) ?? 'openrouter::meta-llama/llama-3.1-70b-instruct',
  )
  const [textValue, setTextValue] = useState('')

  const handleSend = (action: 'append' | 'run') => {
    if (!resourceKey) return console.error('No model selected')

    actions
      .send({
        text: textValue,
        model: { provider: resourceKey.split('::')[0]!, id: resourceKey.split('::')[1]! },
        action,
      })
      .then((result) => {
        console.log(result)
        if (result !== null) setTextValue('')
      })
      .catch((err) => console.error(err))
  }

  return (
    <div className="flex w-full shrink-0 flex-col overflow-hidden border-t border-gray-5 [&>div]:shrink-0">
      <div className="flex">
        <Textarea
          minRows={2}
          maxRows={20}
          placeholder="Enter your prompt..."
          value={textValue}
          onValueChange={setTextValue}
          onSend={() => handleSend('run')}
        />
      </div>

      <div className="flex gap-2 overflow-hidden border-t border-grayA-3 p-2">
        <ModelPickerCmd value={resourceKey} onValueChange={setResourceKey}>
          <ModelButton resourceKey={resourceKey} />
        </ModelPickerCmd>

        <div className="my-auto hidden h-fit items-center rounded bg-grayA-2 p-1 font-mono text-xs text-gray-10 sm:flex">
          {resourceKey.split('::')[1]}
        </div>

        <div className="flex-end ml-auto shrink-0 gap-2">
          <AddButton loading={loading} onClick={() => handleSend('append')} />
          <SendButton loading={loading} onClick={() => handleSend('run')} />
        </div>
      </div>
    </div>
  )
})
Composer.displayName = 'Composer'

const Textarea = ({
  onChange,
  onValueChange,
  onSend,
  ...props
}: { onValueChange?: (value: string) => unknown; onSend?: () => unknown } & Partial<
  React.ComponentProps<typeof ReactTextareaAutosize>
>) => {
  return (
    <ReactTextareaAutosize
      {...props}
      onChange={(e) => {
        onValueChange?.(e.target.value)
        onChange?.(e)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          onSend?.()
        }
      }}
      className="w-full resize-none bg-transparent p-2 text-base text-gray-12 outline-none placeholder:text-grayA-9"
    />
  )
}

const AddButton = (props: Partial<React.ComponentProps<typeof IconButton>>) => {
  return (
    <IconButton variant="surface" color="gray" aria-label="Add message" {...props}>
      <Icons.ArrowUp size={18} />
    </IconButton>
  )
}

const SendButton = (props: Partial<React.ComponentProps<typeof Button>>) => {
  return (
    <Button variant="surface" {...props}>
      Run
      <CommandEnter />
    </Button>
  )
}

const CommandEnter = () => {
  return (
    <div className="flex rounded bg-grayA-5 p-0.5">
      <Icons.Command />
      <Icons.ArrowElbowDownLeft />
    </div>
  )
}

function getModelKey(kvMetadata: Record<string, string>) {
  const id = kvMetadata['esuite:model:id']
  const provider = kvMetadata['esuite:model:provider']
  if (!id || !provider) return undefined
  return `${provider}::${id}`
}
