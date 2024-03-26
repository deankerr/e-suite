'use client'

import { Button, Dialog } from '@radix-ui/themes'

import { ImageModelCard } from '@/components/generations/ImageModelCard'

import type { ImageModel } from '@/convex/generations/imageModels'

export const ImageModelPickerDialog = ({
  list,
  children,
  onValueChange = () => {},
  ...props
}: {
  list?: ImageModel[]
  onValueChange?: (value: ImageModel) => unknown
} & React.ComponentProps<typeof Dialog.Content>) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content {...props}>
        <Dialog.Title>Select Model</Dialog.Title>

        <div className="grid-col grid place-content-center gap-4 md:grid-cols-[repeat(auto-fit,_18rem)]">
          {list?.map((im) => (
            <Dialog.Close key={im._id} onClick={() => onValueChange(im)}>
              <ImageModelCard key={im._id} from={im} />
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
