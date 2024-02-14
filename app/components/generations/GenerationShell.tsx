'use client'

import { ImageModelCard } from '@/app/components/generations/ImageModelCard'
import type { Generation } from '@/convex/generations/do'
import { cn } from '@/lib/utils'
import { Em, Heading, Separator, Strong } from '@radix-ui/themes'
import { FileImageIcon } from 'lucide-react'
import NextLink from 'next/link'
import { Permissions } from '../Permissions'
import { Button } from '../ui/Button'
import { Shell } from '../ui/Shell'
import { StoredImage } from '../ui/StoredImage'
import { DeleteGenerationDialog } from './DeleteGenerationDialog'

export const GenerationShell = ({ generation }: { generation: Generation }) => {
  const { author, images } = generation
  const creator = generation.author.username
  const parameters = generation.images[0]!.parameters!

  return (
    <Shell.Root>
      <Shell.TitleBar icon={FileImageIcon}>{parameters.prompt}</Shell.TitleBar>

      <Shell.Content className="grid content-center">
        <div className={cn('flex h-full flex-wrap items-center justify-center gap-1')}>
          {images.map((image) => (
            <StoredImage
              key={image._id}
              image={image}
              className={cn(
                'rounded border',
                image.height > image.width && 'max-w-[24%]',
                image.height === image.width && 'max-w-[48%]',
                image.height < image.width && 'max-w-[49%]',
              )}
            />
          ))}
        </div>
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
        {author.isViewer && (
          <div className="pt-1">
            <Permissions permissions={generation.permissions} onValueChange={() => {}} />
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
}
