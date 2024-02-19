import { IconButton } from '@/app/components/ui/IconButton'
import { TextArea } from '@/app/components/ui/TextArea'
import { cn } from '@/lib/utils'
import { SendIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { TextInputData, useThreadsAtom } from './threads.store'

type MessageInputProps = {
  inputData: TextInputData
  onSend: () => void
} & React.ComponentProps<'div'>

export const MessageInput = forwardRef<HTMLDivElement, MessageInputProps>(function MessageInput(
  { inputData, onSend, className, ...props },
  forwardedRef,
) {
  const [value, setValue] = useThreadsAtom(inputData)
  return (
    <div {...props} className={cn('flex items-center gap-2 p-2', className)} ref={forwardedRef}>
      <TextArea minRows={1} value={value} onChange={(e) => setValue(e.target.value)} />
      <IconButton lucideIcon={SendIcon} variant="outline" onClick={() => onSend()} />
    </div>
  )
})
