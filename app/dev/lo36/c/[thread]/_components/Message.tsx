import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'

import { Marble } from '@/app/dev/lo36/c/[thread]/_components/Marble'
import { ImageCard } from '@/components/images/ImageCard'
import { Markdown } from '@/components/message/Markdown'
import { cn, getInferenceConfig } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

export const ImgMessage = ({
  message,
  className,
  ...props
}: { message: EMessage } & React.ComponentProps<'div'>) => {
  const { textToImageConfig } = getInferenceConfig(message.inference)

  const text = textToImageConfig ? textToImageConfig.prompt : message.text

  return (
    <div
      {...props}
      className={cn(
        'w-full rounded border border-transparent p-2 even:bg-grayA-3 hover:border-grayA-4',
        className,
      )}
    >
      {message.images.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 py-2">
          {message.images.map((image) => (
            <div className="w-full max-w-[45%]" key={image._id}>
              <ImageCard image={image} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const Message = ({
  message,
  className,
  ...props
}: { message: EMessage } & React.ComponentProps<'div'>) => {
  const { textToImageConfig } = getInferenceConfig(message.inference)

  const name = getMessageName(message)
  const text = textToImageConfig ? textToImageConfig.prompt : message.text
  const isShortMessage = text !== undefined && text.length < 500

  const [messageTime] = useState(new Date(message._creationTime).toTimeString().slice(0, 5))

  return (
    <div
      {...props}
      className={cn(
        'miXn-h-14 grid grid-cols-[minmax(min-content,_1fr)_minmax(0,_80ch)_minmax(min-content,_1fr)] rounded border border-transparent p-1 hover:border-gray-5',
        className,
      )}
    >
      {/* * left gutter * */}
      <div className="flex shrink-0 justify-end">
        <div className="text-gray-10" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {messageTime ?? '00:00'}
        </div>

        <div
          className={cn(
            'ml-2 mr-1 flex h-[1.25rem] shrink-0 items-center',
            message.role === 'assistant' && 'rotate-45 -scale-75',
          )}
        >
          <Marble name={name} size={15} square={message.role === 'assistant'} />
        </div>
      </div>

      {/* * content * */}
      <div className="">
        <span
          className={cn(
            'mr-1 shrink-0 font-medium text-brown-11',
            // message.role === 'user' ? 'text-cyan-12' : 'text-ruby-12',
          )}
        >
          {name}
        </span>{' '}
        {text && text.length > 300 ? <Markdown text={text} /> : text}
      </div>

      {/* * right gutter * */}
      <div className="flex shrink-0 justify-center">
        {/* <IconButton variant="ghost" size="1">
          <Icons.CaretCircleDoubleRight size={20} />
        </IconButton> */}
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
