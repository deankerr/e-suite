import { IconButton } from '@/app/components/ui/IconButton'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { SendIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { Textarea } from '../ui/Textarea'
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
      className={cn('flex w-full items-center gap-2 p-2', className)}
      ref={forwardedRef}
    >
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
      <IconButton
        lucideIcon={SendIcon}
        variant="outline"
        onClick={() => send()}
        disabled={!value}
      />
    </div>
  )
})
