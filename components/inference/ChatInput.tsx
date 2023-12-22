import { SendHorizontalIcon } from 'lucide-react'
import { IconButton } from '../ui/Button'

type ChatInputProps = {
  props?: any
}

export const ChatInput = ({ props }: ChatInputProps) => {
  return (
    <div className="w-full">
      <form className="flex gap-x-2">
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <textarea
          id="chat"
          rows={1}
          className="block w-full rounded-lg border border-n-300 bg-n-50 p-2.5 text-sm text-gray-900 dark:border-n-600 dark:bg-n-900 dark:text-n-50 dark:placeholder-gray-400"
          placeholder="Speak..."
        ></textarea>
        <IconButton className="border-n-600 bg-n-50 text-n-600 hover:bg-n-900 dark:bg-n-800 dark:text-n-200">
          <SendHorizontalIcon className="size-5 flex-shrink-0" />
        </IconButton>
      </form>
    </div>
  )
}
