import { ImageCard } from '@/components/images/ImageCard'
import { cn, getInferenceConfig, stringHashToListItem } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

export const Message = ({
  message,
  className,
  ...props
}: { message: EMessage } & React.ComponentProps<'div'>) => {
  const { textToImageConfig } = getInferenceConfig(message.inference)

  const name = getMessageName(message)
  const nameColor = stringHashToListItem(name, colorVars)
  const text = textToImageConfig ? textToImageConfig.prompt : message.text
  return (
    <div
      {...props}
      className={cn('w-full rounded border border-transparent p-2 hover:border-grayA-4', className)}
    >
      <div className="flex gap-1 text-sm">
        <div className="flex shrink-0 items-center self-start p-1">
          <div className={cn('size-3 rounded-full', nameColor)}></div>
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

const colorVarsDark = [
  'bg-[--red-9]',
  'bg-[--crimson-9]',
  'bg-[--pink-9]',
  'bg-[--plum-9]',
  'bg-[--purple-9]',
  'bg-[--iris-9]',
  'bg-[--blue-9]',
  'bg-[--cyan-9]',
  'bg-[--teal-9]',
  'bg-[--grass-9]',
  'bg-[--brown-9]',
  'bg-[--gold-9]',
  'bg-[--sky-9]',
  'bg-[--lime-9]',
  'bg-[--yellow-9]',
  'bg-[--amber-9]',
  'bg-[--orange-9]',
]

const colorVarsLight = [
  'bg-[--ruby-11]',
  'bg-[--pink-11]',
  'bg-[--plum-11]',
  'bg-[--iris-11]',
  'bg-[--cyan-11]',
  'bg-[--teal-11]',
  'bg-[--green-11]',
  'bg-[--gold-11]',
  'bg-[--yellow-11]',
  'bg-[--amber-11]',
  'bg-[--orange-11]',
]

const colorVars = colorVarsDark.concat(colorVarsLight)
