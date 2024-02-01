'use client'

import { ImageModelCard } from '@/app/components/card/ImageModelCard'
import { api } from '@/convex/_generated/api'
import { ImageModelResult } from '@/convex/types'
import { Button, Dialog, ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { Shell } from './Shell'

type ImageModelPickerProps = {
  props?: unknown
}

export const ImageModelPicker = ({}: ImageModelPickerProps) => {
  const results = useQuery(api.imageModels.list, { type: 'checkpoint' })

  return (
    <Shell.Root>
      <Shell.TitleBar className="col-span-2">Search</Shell.TitleBar>
      <Shell.Content className="col-span-2 max-h-[90vh]">
        <ScrollArea className="">
          <div className="flex flex-wrap justify-center gap-2">
            {results?.map((result) => (
              <ImageModelCard key={result.imageModel._id} from={result} className="h-36 w-80" />
            ))}
          </div>
        </ScrollArea>
      </Shell.Content>
    </Shell.Root>
  )
}

export const ImageModelPickerDialog = ({
  list = [],
  children,
  onValueChange = () => {},
  ...props
}: {
  list?: ImageModelResult[]
  onValueChange?: (value: ImageModelResult) => unknown
} & React.ComponentProps<typeof Dialog.Content>) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content {...props}>
        <Dialog.Title>Select Model</Dialog.Title>

        <div className="grid-col grid place-content-center gap-4 md:grid-cols-[repeat(auto-fit,_18rem)]">
          {list.map((im) => (
            <Dialog.Close key={im.imageModel._id} onClick={() => onValueChange(im)}>
              <ImageModelCard key={im.imageModel._id} from={im} />
            </Dialog.Close>
          ))}
        </div>

        <div className="flex justify-end py-4">
          <Dialog.Close>
            <Button variant="soft">Close</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
