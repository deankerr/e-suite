import { HeartIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { forwardRef } from 'react'
import { Button } from './ui/button'
import { TextareaAutosize } from './ui/textarea-autosize'

type Props = {}
export const DynamicTextarea = forwardRef<HTMLDivElement, Props>(
  function DynamicTextarea(props, ref) {
    const isValidInput = false
    return (
      <div className="flex items-end rounded-3xl border px-2 py-2 focus-within:ring-1 focus-within:ring-ring">
        <Button className="rounded-2xl" variant="outline" type="submit">
          <HeartIcon />
        </Button>
        <TextareaAutosize
          className="w-full resize-none bg-transparent px-2 py-1.5 placeholder:text-muted-foreground focus-visible:outline-none"
          placeholder="Speak..."
          rows={1}
        />
        <Button
          className="rounded-2xl"
          variant={isValidInput ? 'default' : 'outline'}
          type="submit"
        >
          <PaperPlaneIcon />
        </Button>
      </div>
    )
  },
)
