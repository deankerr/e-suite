import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, Card, IconButton } from '@radix-ui/themes'

import { Image } from '@/components/images/Image'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
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
  const [showCaptionPanel, setShowCaptionPanel] = useState(false)

  return (
    <Card
      style={{ aspectRatio: image.width / image.height }}
      className={cn('group flex flex-col justify-between gap-2', className)}
      {...props}
    >
      <Image
        key={image._id}
        alt=""
        src={image._id}
        placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image?.blurDataUrl}
        style={{ objectFit: 'contain' }}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        {...imageProps}
      />

      {/* * top panel * */}
      <div className="flex shrink-0 justify-between">
        <div className="font-mono text-xs text-gray-11">
          {image.width}x{image.height}
        </div>

        <IconButton
          variant="ghost"
          color="gray"
          radius="full"
          size="1"
          className="group-hover:bg-[var(--card-1-light)] group-hover:backdrop-blur"
        >
          <Icons.DotsThreeVertical className="size-9 text-white" weight="bold" />
        </IconButton>
      </div>

      {/* * caption panel * */}
      <CaptionPanel
        image={image}
        className={cn('', showCaptionPanel ? 'opacity-100' : 'opacity-0')}
      />

      {/* * bottom panel * */}
      <div className="flex shrink-0 items-center justify-between">
        <VoteButtonPanel />

        <IconButton
          variant="ghost"
          color="gray"
          size="1"
          radius="full"
          className="group-hover:bg-[var(--card-1-light)] group-hover:backdrop-blur"
          onClick={() => setShowCaptionPanel((prev) => !prev)}
        >
          <Icons.Info className="size-9 text-white" weight="regular" />
        </IconButton>
      </div>
    </Card>
  )
}

const CaptionPanel = ({
  image,
  className,
  ...props
}: { image: EImage } & React.ComponentProps<'div'>) => {
  return (
    <Card
      {...props}
      size="1"
      className={cn(
        'flex flex-col backdrop-blur transition-opacity [--card-background-color:var(--card-1)]',
        className,
      )}
    >
      <div className="shrink-0 border-b border-grayA-6 pb-1 text-xs font-semibold">
        auto-generated caption
      </div>
      <div className="my-1 grow overflow-y-auto text-sm">
        {/* {image.captionText?.concat(' ').repeat(20)} */}
        {!image.captionModelId && !image.captionText && (
          <span className="italic">No caption available</span>
        )}
        {image.captionModelId && !image.captionText && <LoadingSpinner className="size-4" />}
        {image.captionText}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-grayA-6 pt-1 font-mono text-xs text-gray-11">
        <div
          className="truncate rounded border border-transparent px-1 py-0.5"
          title={image.captionModelId}
        >
          {image.captionModelId}
        </div>
        {image.nsfwProbability !== undefined && (
          <div className="shrink-0 rounded border border-grayA-6 px-1 py-0.5">{`${Math.round(image.nsfwProbability * 100)}%`}</div>
        )}
      </div>
    </Card>
  )
}

const VoteButtonPanel = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <Card
      {...props}
      size="1"
      variant="surface"
      className={cn(
        'm-0 flex p-2 transition-colors [--card-background-color:#00000000] group-hover:backdrop-blur group-hover:[--card-background-color:var(--card-1-light)]',
        className,
      )}
    >
      <Button variant="ghost" color="blue" size="1" className="m-0">
        <Icons.SketchLogo size={16} />5
      </Button>
      <Button variant="ghost" color="green" size="1" className="m-0">
        <Icons.ThumbsUp size={16} />1
      </Button>
      <Button variant="ghost" color="yellow" size="1" className="m-0">
        <Icons.MaskSad size={16} />1
      </Button>
      <Button variant="ghost" color="red" size="1" className="m-0">
        <Icons.Biohazard size={16} />4
      </Button>
    </Card>
  )
}
