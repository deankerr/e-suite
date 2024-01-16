import { ImageModelCard } from '@/app/components/ImageModelCard'
import { api } from '@/convex/_generated/api'
import { ImageModel } from '@/convex/types'
import { Button, Card, Separator, Text } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'
import { CheckSquareIcon, ChevronsUpDownIcon } from 'lucide-react'
import { useState } from 'react'

type ImageModelPicker = {
  imageModel: ImageModel | undefined
  onChange: (imageModel: ImageModel) => unknown
}

export const ImageModelPicker = ({ imageModel, onChange }: ImageModelPicker) => {
  const [open, setOpen] = useState(false)

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.imageModels.page,
    {},
    { initialNumItems: 10 },
  )

  const select = (m: ImageModel) => {
    onChange(m)
    setOpen(false)
  }

  return (
    <>
      <div className="my-0 font-code text-[8px] text-gold-8">
        {'<ImageModelPicker>'} imageModel._id:{String(imageModel?._id)} open:{String(open)}
      </div>

      {imageModel ? (
        <ImageModelCard
          className="cursor-pointer"
          imageModel={imageModel}
          buttonSash={<ChevronsUpDownIcon />}
          onClick={() => setOpen(!open)}
        />
      ) : (
        <Card className="h-36 flex-none cursor-pointer" onClick={() => setOpen(!open)}>
          <div className="grid h-full place-content-center">
            <Text size="6" as="div" className="font-code text-accent-9">
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
          <div className="space-y-4">
            {results.map((m) => (
              <ImageModelCard
                key={m._id}
                imageModel={m}
                buttonSash={<CheckSquareIcon />}
                onClick={() => select(m)}
              />
            ))}
            <Button onClick={() => loadMore(10)}>Load more</Button>
          </div>
        </>
      ) : null}
    </>
  )
}
