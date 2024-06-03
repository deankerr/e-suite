'use client'

import * as React from 'react'
import { useImperativeHandle } from 'react'

import { cn } from '@/lib/utils'

// https://shadcnui-expansions.typeart.cc/docs/autosize-textarea

interface UseAutosizeTextAreaProps {
  textAreaRef: HTMLTextAreaElement | null
  minHeight?: number
  maxHeight?: number
  triggerAutoSize: string
}

export const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
}: UseAutosizeTextAreaProps) => {
  const [init, setInit] = React.useState(true)
  React.useEffect(() => {
    // We need to reset the height momentarily to get the correct scrollHeight for the textarea
    const offsetBorder = 2
    if (textAreaRef) {
      if (init) {
        textAreaRef.style.minHeight = `${minHeight + offsetBorder}px`
        if (maxHeight > minHeight) {
          textAreaRef.style.maxHeight = `${maxHeight}px`
        }
        setInit(false)
      }
      textAreaRef.style.height = `${minHeight + offsetBorder}px`
      const scrollHeight = textAreaRef.scrollHeight
      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      if (scrollHeight > maxHeight) {
        textAreaRef.style.height = `${maxHeight}px`
      } else {
        textAreaRef.style.height = `${scrollHeight + offsetBorder}px`
      }
    }
  }, [init, maxHeight, minHeight, textAreaRef, triggerAutoSize])
}

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement
  maxHeight: number
  minHeight: number
}

type AutosizeTextAreaProps = {
  maxHeight?: number
  minHeight?: number
  onValueChange?: (value: string) => unknown
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<AutosizeTextAreaRef, AutosizeTextAreaProps>(
  (
    {
      maxHeight = Number.MAX_SAFE_INTEGER,
      minHeight = 36,
      className,
      onChange,
      value,
      onValueChange,
      defaultValue,
      ...props
    }: AutosizeTextAreaProps,
    ref: React.Ref<AutosizeTextAreaRef>,
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const [triggerAutoSize, setTriggerAutoSize] = React.useState('')

    useAutosizeTextArea({
      textAreaRef: textAreaRef.current,
      triggerAutoSize: triggerAutoSize,
      maxHeight,
      minHeight,
    })

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef.current?.focus(),
      maxHeight,
      minHeight,
    }))

    const textAreaValue = value ?? defaultValue
    React.useEffect(() => {
      if (typeof textAreaValue === 'string') {
        setTriggerAutoSize(textAreaValue)
      }
    }, [textAreaValue])

    return (
      <textarea
        {...props}
        value={value}
        ref={textAreaRef}
        rows={1}
        className={cn(
          'flex focus-visible:outline-1 focus-visible:outline-accent-8 disabled:cursor-not-allowed disabled:opacity-50',
          'w-full resize-none rounded border border-grayA-7 bg-black/25 px-3 py-2 text-gray-12 placeholder:text-gray-9',
          className,
        )}
        onChange={(e) => {
          setTriggerAutoSize(e.target.value)
          onValueChange?.(e.target.value)
          onChange?.(e)
        }}
      />
    )
  },
)
Textarea.displayName = 'AutosizeTextarea'
