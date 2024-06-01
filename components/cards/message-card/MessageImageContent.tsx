import { ImageCard } from '@/components/images/ImageCard'
import { cn } from '@/lib/utils'

import type { EMessageWithContent } from '@/convex/shared/structures'

type MessageImageContentProps = {
  files: EMessageWithContent['files']
} & React.ComponentProps<'div'>

export const MessageImageContent = ({ files, className, ...props }: MessageImageContentProps) => {
  if (!files) return null

  return (
    <div {...props} className={cn('', className)}>
      <div className="font-mono text-xs text-gray-11">images</div>
      <div className={cn('mx-auto grid w-fit gap-2', files.length > 1 && 'grid-cols-2')}>
        {files.map((file) => {
          if (file.type === 'image') {
            return (
              <ImageCard key={file.id} image={file.image} sizes="(max-width: 56rem) 50vw, 28rem" />
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
