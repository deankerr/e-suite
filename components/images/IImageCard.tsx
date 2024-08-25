import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import NextImage from 'next/image'
import Link, { LinkProps } from 'next/link'

import { DotsThreeFillY } from '@/components/icons/DotsThreeFillY'
import { DeleteImageDialog } from '@/components/images/dialogs'
import { IconButton } from '@/components/ui/Button'

import type { EImage } from '@/convex/types'

export const IImageCard = ({
  image,
  sizes,
  priority,
  href,
}: {
  image: EImage
  sizes?: string
  priority?: boolean
  href?: LinkProps['href']
}) => {
  const [showDeleteImageDialog, setShowDeleteImageDialog] = useState(false)

  return (
    <div
      style={{
        aspectRatio: `${image.width} / ${image.height}`,
      }}
      className="max-h-full overflow-hidden rounded-lg border border-gray-4"
    >
      <NextImage
        alt=""
        src={`/i/${image.id}`}
        placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image?.blurDataUrl}
        width={image.width}
        height={image.height}
        className="h-full w-full object-contain"
        sizes={sizes}
        priority={priority}
      />

      {href && <Link href={href} className="absolute inset-0" />}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton
            aria-label="Options menu"
            variant="ghost"
            highContrast
            className="absolute right-1 top-1"
          >
            <DotsThreeFillY width={28} height={28} />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant="soft">
          <Link href={`/convex/${image.id}?download`}>
            <DropdownMenu.Item>
              <Icons.DownloadSimple size={16} />
              Download
            </DropdownMenu.Item>
          </Link>

          {image.userIsViewer && (
            <DropdownMenu.Item color="red" onClick={() => setShowDeleteImageDialog(true)}>
              <Icons.Trash size={16} />
              Delete
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <DeleteImageDialog
        id={image.id}
        open={showDeleteImageDialog}
        onOpenChange={setShowDeleteImageDialog}
      />
    </div>
  )
}
