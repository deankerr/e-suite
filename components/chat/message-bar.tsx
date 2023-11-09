import { Button } from '@/components/ui/button'
import { TextareaAutosize } from '@/components/ui/textarea-autosize'
import { cn } from '@/lib/utils'
import { HeartIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export function MessageBar({
  handleSubmit,
  className,
  ...props
}: { handleSubmit: (value: string) => void } & React.ComponentProps<'div'>) {
  const [value, setValue] = useState('')

  const send = () => {
    if (value === '') return
    handleSubmit(value)
    setValue('')
  }

  return (
    <div
      {...props}
      className={cn(
        'flex w-full items-end rounded-3xl border bg-background px-2 py-2 focus-within:ring-1 focus-within:ring-ring',
        className,
      )}
    >
      <Button className="rounded-2xl" variant="outline" type="button">
        <HeartIcon />
      </Button>
      <TextareaAutosize
        className="w-full resize-none bg-transparent px-2 py-1.5 placeholder:text-muted-foreground focus-visible:outline-none"
        placeholder="Speak..."
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey) {
            send()
          }
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        className="rounded-2xl"
        variant={value && value !== '' ? 'default' : 'outline'}
        onClick={send}
      >
        <PaperPlaneIcon />
      </Button>
    </div>
  )
}
