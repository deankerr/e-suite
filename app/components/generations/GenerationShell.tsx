'use client'

import { ImageModelCard } from '@/app/components/generations/ImageModelCard'
import { api } from '@/convex/_generated/api'
import type { Generation } from '@/convex/generations/do'
import { cn } from '@/lib/utils'
import { Em, Heading, Separator, Strong } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { FileImageIcon } from 'lucide-react'
import NextLink from 'next/link'
import { forwardRef } from 'react'
import { Permissions } from '../Permissions'
import { Button } from '../ui/Button'
import { Shell } from '../ui/Shell'
import { StoredImage } from '../ui/StoredImage'
import { DeleteGenerationDialog } from './DeleteGenerationDialog'

type Props = {
  generation: Generation
  focus?: number
}

export const GenerationShell = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function GenerationShell({ generation, focus, className, ...props }, forwardedRef) {
    const { author, images } = generation
    const updatePermissions = useMutation(api.generations.do.updatePermissions)

    const focusItem = focus ? images[focus] : undefined

    const parameters = focusItem?.parameters ?? generation.images[0]!.parameters!

    return (
      <Shell.Root {...props} className={cn('', className)} ref={forwardedRef}>
        <Shell.TitleBar icon={FileImageIcon}>{parameters.prompt}</Shell.TitleBar>

        <Shell.Content className="grid">
          {focusItem && (
            <div className="grid w-full place-content-center">
              <StoredImage image={focusItem} className={cn('rounded border')} />
            </div>
          )}
          {!focusItem && (
            <div className={cn('grid grid-cols-2 place-content-center gap-1 justify-self-center')}>
              {images.map((image, i) => (
                <NextLink
                  href={`/generations/${generation._id}/${i}`}
                  className={cn(
                    image.height > image.width && (i === 0 || i === 2) && 'justify-self-end',
                    image.height > image.width ? 'max-w-[256px]' : 'max-w-[340px]',
                  )}
                >
                  <StoredImage
                    key={image._id}
                    image={image}
                    className={cn('max-w-full rounded border')}
                  />
                </NextLink>
              ))}
            </div>
          )}
        </Shell.Content>

        <Shell.Controls>
          <Button asChild>
            <NextLink href={`/generations/${generation._id}`}>Link</NextLink>
          </Button>
          {/* <Button variant="outline">Copy</Button> */}
          {author.isViewer && (
            <DeleteGenerationDialog id={generation._id}>
              <Button variant="outline" color="red">
                Delete
              </Button>
            </DeleteGenerationDialog>
          )}
        </Shell.Controls>

        <Shell.Sidebar className="px-rx-2">
          {author.isViewer && !focusItem && (
            <div className="pt-1">
              <Permissions
                permissions={generation.permissions}
                onPermissionsChange={(permissions) =>
                  void updatePermissions({
                    id: generation._id,
                    permissions,
                  })
                }
              />
            </div>
          )}

          <div className="py-rx-4 text-center">
            <Em>&quot;created by&quot;</Em> <Strong>{author.username}</Strong>
          </div>

          <Separator size="4" />

          <div className="py-rx-4 text-sm">
            <Heading size="1">Prompt</Heading>
            <div>{parameters.prompt}</div>
          </div>

          <Separator size="4" />

          <div className="py-rx-4 text-sm">
            <Heading size="1">Negative prompt</Heading>
            <div>{parameters.negativePrompt || <i>blank</i>}</div>
          </div>

          <ImageModelCard fromId={parameters.imageModelId} className="mx-auto" />

          <div className="absolute bottom-0 right-1 text-right font-code text-[8px] text-gold-5">
            {generation._id}
          </div>
        </Shell.Sidebar>
      </Shell.Root>
    )
  },
)
