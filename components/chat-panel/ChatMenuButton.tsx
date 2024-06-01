import { forwardRef } from 'react'
import { ChevronsUpDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type ChatMenuButtonProps = { title: string; modelName: string } & React.ComponentProps<'button'>

export const ChatMenuButton = forwardRef<HTMLButtonElement, ChatMenuButtonProps>(
  function ChatMenuButton({ title, modelName, className, ...props }, forwardedRef) {
    return (
      <button
        ref={forwardedRef}
        {...props}
        className={cn(
          'inline-flex grow items-center justify-center whitespace-nowrap rounded-md py-1 text-sm font-medium ring-accent-7 ring-offset-gray-1 transition-colors hover:bg-gray-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-8 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      >
        <div className="w-6 shrink-0">{/* <DotIcon className="text-gray-10" /> */}</div>
        <div className="grow">
          <div>{title}</div>
          <div className="font-normal text-gray-11">{modelName}</div>
        </div>
        <div className="w-6 shrink-0">
          <ChevronsUpDownIcon className="text-gray-10" />
        </div>
      </button>
    )
  },
)
