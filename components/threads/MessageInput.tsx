import { forwardRef } from 'react'
import { useAtom } from 'jotai'
import { SendHorizonalIcon, SmileIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Textarea } from '../ui/Textarea'
import { UIIconButton } from '../ui/UIIconButton'
import { TextInputAtom } from './useThread'

type MessageInputProps = {
  inputAtom: TextInputAtom
  onSend: () => void
} & React.ComponentProps<'div'>

export const MessageInput = forwardRef<HTMLDivElement, MessageInputProps>(function MessageInput(
  { inputAtom, onSend, className, ...props },
  forwardedRef,
) {
  const [value, setValue] = useAtom(inputAtom.atom)

  const send = () => {
    if (value) onSend()
  }

  return (
    <div
      {...props}
      className={cn('flex h-16 shrink-0 items-center gap-3 border-t bg-gray-1 px-3', className)}
      ref={forwardedRef}
    >
      <UIIconButton icon={SmileIcon} label="do something with a smiley face" disabled />

      <Textarea
        hideLabel
        inputAtom={inputAtom}
        minRows={1}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
      />

      <UIIconButton
        icon={SendHorizonalIcon}
        label="send message"
        // variant="outline"
        onClick={() => send()}
        disabled={!value}
      />
    </div>
  )
})
