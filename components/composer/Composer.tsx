'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import ReactTextareaAutosize from 'react-textarea-autosize'

import { ModelPickerCmd } from '@/components/command/ModelPickerCmd'
import { ModelButton } from '@/components/composer/ModelButton'
import { Button, IconButton } from '@/components/ui/Button'

import type { ThreadActions } from '@/lib/api'

export const Composer = ({
  initialResourceKey = '',
  defaultTextValue = '',
  loading = false,
  onAppend,
  onRun,
}: {
  initialResourceKey?: string
  defaultTextValue?: string
  loading?: boolean
  onAppend?: ThreadActions['append']
  onRun?: (text: string, model: { provider: string; id: string }) => void
}) => {
  const [resourceKey, setResourceKey] = useState(initialResourceKey)

  const [textValue, setTextValue] = useState(defaultTextValue)

  const handleAppend = () => {
    onAppend?.({ message: { text: textValue, role: 'user' } }).then((success) => {
      if (success) {
        setTextValue('')
      }
    })
  }

  const handleRun = () => {
    onRun?.(textValue, {
      provider: resourceKey.split('::')[0]!,
      id: resourceKey.split('::')[1]!,
    })
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
          onSend={() => handleRun()}
        />
      </div>

      <div className="flex gap-2 overflow-hidden border-t border-grayA-3 p-2">
        <ModelPickerCmd value={resourceKey} onValueChange={setResourceKey}>
          <ModelButton resourceKey={resourceKey} />
        </ModelPickerCmd>
        <div className="flex-end ml-auto shrink-0 gap-2">
          <AddButton loading={loading} onClick={() => handleAppend()} />
          <SendButton loading={loading} onClick={() => handleRun()} />
        </div>
      </div>
    </div>
  )
}

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
