import { GoldSparkles } from '@/components/effects/GoldSparkles'
import { ImageCard } from '@/components/images/ImageCard'
import { EMessage } from '@/convex/shared/types'
import { cn } from '@/lib/utils'

export const ImageGallery = ({ message }: { message: EMessage }) => {
  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const files = message.files
  if (!(textToImage || files)) return null
  return (
    <div className="w-fit max-w-full rounded-lg bg-grayA-2 p-2">
      <div
        className={cn(
          'mx-auto flex justify-center py-1',
          files?.length !== 0 ? 'grid grid-cols-2 gap-2' : '',
        )}
      >
        {files?.map((file, i) => {
          if (file.type === 'image_url') {
            const width = textToImage?.width ?? 1024
            const height = textToImage?.height ?? 1024
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl"
                style={{ aspectRatio: width / height, width: width, maxWidth: '100%' }}
              >
                <GoldSparkles />
              </div>
            )
          }

          if (file.type === 'image') {
            return (
              <ImageCard key={file.id} image={file.image} sizes="(max-width: 56rem) 50vw, 28rem" />
            )
          }
        })}
      </div>
    </div>
  )
}
