import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'

import { Marble } from '@/app/dev/lo36/c/[thread]/_components/Marble'
import { ImageCard } from '@/components/images/ImageCard'
import { Markdown } from '@/components/message/Markdown'
import { cn, getInferenceConfig } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

export const Message = ({
  message,
  className,
  ...props
}: { message: EMessage } & React.ComponentProps<'div'>) => {
  const { textToImageConfig } = getInferenceConfig(message.inference)

  const name = getMessageName(message)
  const text = textToImageConfig ? textToImageConfig.prompt : message.text
  // const isShortMessage = text !== undefined && text.length < 500

  const [messageTime] = useState(new Date(message._creationTime).toTimeString().slice(0, 5))

  return (
    <div
      {...props}
      className={cn(
        'grid shrink-0 grid-cols-[minmax(72px,_1fr)_minmax(0,_768px)_minmax(48px,_1fr)]',
        'rounded-md border border-transparent hover:border-gray-5',
        'box-content min-h-7 gap-1 text-sm',
        className,
      )}
    >
      {/* # left gutter # */}
      <div className="sXelf-start flex items-center gap-1.5 border-r border-grayA-2 pl-1">
        {/* * time * */}
        <div className="shrink-0 text-gray-10" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {messageTime ?? '00:00'}
        </div>

        {/* * marble * */}
        <Marble name={name} size={15} className={cn('flex overflow-hidden')} />
      </div>

      {/* # content # */}
      <div className="border-x border-grayA-2 py-1">
        {/* * name * */}
        <span className={cn('shrink-0 font-medium text-brown-11')}>{name}</span>{' '}
        {text && text.length > 300 ? <Markdown text={text} /> : text}
      </div>

      {/* # right gutter # */}
      <div className="border-l border-grayA-2 text-right">
        <IconButton variant="ghost" size="1" className="m-0 size-7 p-0">
          <Icons.DotsThree size={24} />
        </IconButton>
      </div>
    </div>
  )
}

function getMessageName(message: EMessage) {
  const { textToImageConfig, textToAudioConfig } = getInferenceConfig(message.inference)
  if (textToAudioConfig) return 'elevenlabs sound generation'
  if (textToImageConfig) return textToImageConfig.endpointModelId
  if (message.name) return message.name
  if (message.role === 'user') return 'You'
  return 'Assistant'
}
