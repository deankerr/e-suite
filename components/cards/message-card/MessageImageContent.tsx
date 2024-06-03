import { GoldSparkles } from '@/components/effects/GoldSparkles'
import { ImageCard } from '@/components/images/ImageCard'
import { cn } from '@/lib/utils'

import type { EMessageWithContent } from '@/convex/shared/structures'

type MessageImageContentProps = {
  message: EMessageWithContent
} & React.ComponentProps<'div'>

export const MessageImageContent = ({ message, className, ...props }: MessageImageContentProps) => {
  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const hasErrors = message.jobs.some((job) => job.status === 'failed')
  const filesReady = (message.files ?? []).map((file) => (file.type === 'image' ? file : undefined))

  const slots = textToImage
    ? [...Array(textToImage.parameters.n)].map(
        (_, i) =>
          filesReady[i] ?? {
            type: 'placeholder' as const,
            id: 'placeholder' + i,
            width: textToImage.parameters.width,
            height: textToImage.parameters.height,
          },
      )
    : undefined

  const files = slots ?? message.files
  if (!files) return null
  return (
    <div
      {...props}
      className={cn(
        'mx-auto grid w-fit max-w-full gap-2 overflow-hidden',
        files.length > 1 ? 'grid-cols-2' : 'place-content-center',
        className,
      )}
    >
      {files.map((file) => {
        if (file.type === 'image') {
          return (
            <ImageCard key={file.id} image={file.image} sizes="(max-width: 56rem) 50vw, 28rem" />
          )
        }

        if (file.type === 'placeholder') {
          return (
            <div
              key={file.id}
              className="overflow-hidden rounded-xl border border-transparent"
              style={{ aspectRatio: file.width / file.height, width: file.width, maxWidth: '100%' }}
            >
              {!hasErrors && <GoldSparkles />}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
