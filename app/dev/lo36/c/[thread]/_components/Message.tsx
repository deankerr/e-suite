import { Marble } from '@/app/dev/lo36/c/[thread]/_components/Marble'
import { ImageCard } from '@/components/images/ImageCard'
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
  return (
    <div
      {...props}
      className={cn('w-full rounded border border-transparent p-2 hover:border-grayA-4', className)}
    >
      <div className="flex gap-1.5 text-sm">
        <div className="flex h-[1.25rem] shrink-0 items-center">
          <Marble name={name} size={15} />
        </div>

        <div className="shrink-0 font-medium">{name}</div>

        <div className="break-all text-sm text-gray-11">{text}</div>
      </div>

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

function getMessageName(message: EMessage) {
  const { textToImageConfig, textToAudioConfig } = getInferenceConfig(message.inference)
  if (textToAudioConfig) return 'elevenlabs sound generation'
  if (textToImageConfig) return textToImageConfig.endpointModelId
  if (message.name) return message.name
  if (message.role === 'user') return 'You'
  return 'Assistant'
}
