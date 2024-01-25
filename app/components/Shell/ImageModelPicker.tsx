'use client'

import { ImageModelCard } from '@/app/components/ui/ImageModelCard'
import { api } from '@/convex/_generated/api'
import { ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { Shell } from './Shell'

type ImageModelPickerProps = {
  props?: any
}

export const ImageModelPicker = ({ props }: ImageModelPickerProps) => {
  const imageModels = useQuery(api.imageModels.list, { type: 'checkpoint' })

  return (
    <Shell.Root>
      <Shell.TitleBar className="col-span-2">Search</Shell.TitleBar>
      <Shell.Content className="col-span-2 max-h-[90vh]">
        <ScrollArea className="">
          <div className="flex flex-wrap justify-center gap-2">
            {imageModels?.map((imageModel) => (
              <ImageModelCard key={imageModel._id} imageModel={imageModel} className="h-36 w-80" />
            ))}
          </div>
        </ScrollArea>
      </Shell.Content>
    </Shell.Root>
  )
}
