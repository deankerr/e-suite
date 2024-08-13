import { useEffect, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Card, IconButton } from '@radix-ui/themes'
import Link from 'next/link'

import { Image } from '@/components/images/Image'
import { colors } from '@/components/marble-avatar/colors'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/types'

export const ImageCard = ({
  image,
  imageProps,
  className,
  ...props
}: {
  image: EImage
  imageProps?: Partial<React.ComponentProps<typeof Image>>
} & React.ComponentProps<typeof Card>) => {
  const [showCaption, setShowCaption] = useState(false)

  return (
    <Card
      style={{ aspectRatio: image.width / image.height }}
      className={cn('group flex w-full flex-col justify-between gap-2 p-1', className)}
      {...props}
    >
      <Image
        key={image._id}
        alt=""
        src={`/i/${image.uid}`}
        placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image?.blurDataUrl}
        style={{ objectFit: 'contain' }}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        {...imageProps}
      />

      <ObjectBoxes image={image} />

      {/* * top panel * */}
      <div className="flex shrink-0 justify-between">
        <div className="font-mono text-xs text-gray-11">
          <AdminOnlyUi>
            {image.width}x{image.height}
          </AdminOnlyUi>
        </div>

        <Link href={`/convex/${image.uid}?download`}>
          <IconButton
            aria-label="Download image"
            variant="ghost"
            color="gray"
            size="1"
            className="m-0 group-hover:bg-blackA-4 group-hover:backdrop-blur"
          >
            <Icons.DownloadSimple className="size-6 group-hover:text-white" weight="bold" />
          </IconButton>
        </Link>
      </div>

      {/* * bottom panel * */}
      <div
        className={cn(
          'rounded-md border border-grayA-5 p-2 opacity-50 group-hover:opacity-100',
          showCaption ? 'bg-blackA-7 opacity-100 backdrop-blur' : 'truncate',
        )}
        onClick={() => setShowCaption((prev) => !prev)}
      >
        {image.captionText}
      </div>
    </Card>
  )
}

const ObjectBoxes = ({ image }: { image: EImage }) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (containerRef && image.width && image.height) {
      const updateScale = () => {
        const containerRect = containerRef.getBoundingClientRect()
        const scaleX = containerRect.width / image.width
        const scaleY = containerRect.height / image.height
        setScale(Math.min(scaleX, scaleY))
      }

      updateScale()
      window.addEventListener('resize', updateScale)
      return () => window.removeEventListener('resize', updateScale)
    }
  }, [containerRef, image.width, image.height])

  return (
    <div
      ref={setContainerRef}
      className="pointer-events-none invisible absolute inset-0 overflow-hidden group-hover:visible"
    >
      {image.objects &&
        image.objects
          .filter((obj) => obj.score >= 0.3)
          .map((obj, index) => (
            <div
              key={index}
              className="absolute border-2"
              style={{
                left: `${obj.box.xmin * scale}px`,
                top: `${obj.box.ymin * scale}px`,
                width: `${(obj.box.xmax - obj.box.xmin) * scale}px`,
                height: `${(obj.box.ymax - obj.box.ymin) * scale}px`,
                borderColor: colors[index % colors.length],
              }}
            >
              <span
                className="absolute left-0 top-0 px-1 text-xs text-white"
                style={{ backgroundColor: colors[index % colors.length] }}
              >
                {obj.label} ({obj.score.toFixed(2)})
              </span>
            </div>
          ))}
    </div>
  )
}
