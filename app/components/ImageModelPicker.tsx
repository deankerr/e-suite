import { api } from '@/convex/_generated/api'
import { ImageModel } from '@/convex/types'
import { Button, Card, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'
import { CheckSquareIcon, ChevronsUpDownIcon } from 'lucide-react'
import { useState } from 'react'

type ImageModelPicker = {
  imageModel: ImageModel | undefined
  onChange: (imageModel: ImageModel) => unknown
  open: boolean
  onOpenChange: (open: boolean) => unknown
}

export const ImageModelPicker = ({
  imageModel,
  onChange,
  open,
  onOpenChange,
}: ImageModelPicker) => {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.imageModels.page,
    {},
    { initialNumItems: 6 },
  )

  const select = (m: ImageModel) => {
    onChange(m)
    onOpenChange(false)
  }

  return (
    <>
      <div className="hidden font-code text-[8px] text-gold-8">
        {'<ImageModelPicker>'} open:{String(open)}
      </div>

      <Heading size="2">Model</Heading>
      {imageModel ? (
        // <ImageModelCard
        //   className="cursor-pointer"
        //   imageModel={imageModel}
        //   buttonSash={<ChevronsUpDownIcon />}
        //   onClick={() => onOpenChange(!open)}
        // />
        'update me'
      ) : (
        <Card className="h-36 flex-none cursor-pointer" onClick={() => onOpenChange(!open)}>
          <div className="grid h-full place-content-center">
            <Text size="6" as="div" className="animate-pulse text-accent-8">
              Select Model
            </Text>
          </div>
        </Card>
      )}

      {open ? (
        <>
          <Separator className="my-4 w-full" />
          <div className="font-code text-[8px]">
            status: {status} | isLoading: {String(isLoading)}
          </div>
          <ScrollArea className="h-full" type="hover" scrollbars="vertical">
            <div className="space-y-4">
              {results.map(
                (m) =>
                  // <ImageModelCard
                  //   key={m._id}
                  //   imageModel={m}
                  //   buttonSash={<CheckSquareIcon />}
                  //   onClick={() => select(m)}
                  // />
                  'update me',
              )}
              <Button onClick={() => loadMore(10)}>Load more</Button>
            </div>
          </ScrollArea>
        </>
      ) : null}
    </>
  )
}
