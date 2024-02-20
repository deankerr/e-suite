import { IconButton } from '@/app/components/ui/IconButton'
import { Label } from '@/app/components/ui/Label'
import { TextArea } from '@/app/components/ui/TextArea'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { SendIcon } from 'lucide-react'
import { forwardRef } from 'react'
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
  return (
    <div {...props} className={cn('flex items-center gap-2 p-2', className)} ref={forwardedRef}>
      <Label htmlFor={inputAtom.name} className="sr-only" />
      <TextArea
        name={inputAtom.name}
        minRows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <IconButton lucideIcon={SendIcon} variant="outline" onClick={() => onSend()} />
    </div>
  )
})
