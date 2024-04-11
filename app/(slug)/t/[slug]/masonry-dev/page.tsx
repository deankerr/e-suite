'use client'

import { useState } from 'react'
import { Button, Card, IconButton, Separator, TextField } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import * as R from 'remeda'

import { Img } from '@/components/ui/Img'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

export default function TSlugViewPage({ params }: { params: { slug: string } }) {
  const [showLimit, setShowLimit] = useState(40)
  const [colWidth, setColWidth] = useState(128)
  const thread = useQuery(api.threads.getBySlug, { slug: params.slug })
  const mRemove = useMutation(api.files.images.remove)

  const queryKey = thread?._id
    ? { threadId: thread?._id, role: 'assistant' as const, limit: 40 }
    : 'skip'

  const asstMessages = useQuery(api.threads.messages, queryKey) ?? []

  const imageIds = R.pipe(
    asstMessages,
    R.map((m) => (Array.isArray(m.content) ? m.content : [])),
    R.flat(),
    R.map(({ imageId }) => imageId),
  )

  const images = useQuery(api.files.images.getMany, { imageIds })
  const [listOption, setListOption] = useState('stable')
  console.log(images)
  const [theList, setTheList] = useState(images ?? [])
  const [icList, setIcList] = useState(Array(999).fill(0))
  const [irList, setIrList] = useState(Array(999).fill(0))

  const changeList = (to: string) => {
    if (to === 'stable') {
      if (listOption !== 'stable') setListOption('stable')
      setTheList(images ?? [])
    } else {
      if (listOption === 'stable') setListOption('rand')
      setTheList(R.shuffle(images ?? []))
    }

    setIcList(Array(999).fill(0))
    setIrList(Array(999).fill(0))
  }

  return (
    <div className="p-4 pt-0">
      <div className="sticky top-0 z-50 flex items-start gap-4">
        <div className="flex">
          <Button variant="soft" size="1" onClick={() => setShowLimit(showLimit - 5)}>
            - 5
          </Button>
          <Button variant="soft" size="1" onClick={() => setShowLimit(showLimit - 1)}>
            - 1
          </Button>

          <TextField.Root size="1">
            <TextField.Input
              className="w-12"
              value={showLimit}
              onChange={(e) => setShowLimit(Number(e.target.value))}
            />
          </TextField.Root>

          <Button variant="soft" size="1" onClick={() => setShowLimit(showLimit + 1)}>
            + 1
          </Button>
          <Button variant="soft" size="1" onClick={() => setShowLimit(showLimit + 5)}>
            + 5
          </Button>

          <Separator orientation="vertical" className="mx-4" size="1" />

          <Button onClick={() => setColWidth(colWidth - 8)} size="1" variant="soft">
            -
          </Button>
          <TextField.Root size="1">
            <TextField.Input
              className="w-12"
              value={colWidth}
              onChange={(e) => setColWidth(Number(e.target.value))}
            />
          </TextField.Root>
          <Button onClick={() => setColWidth(colWidth + 8)} size="1" variant="soft">
            +
          </Button>

          <Separator orientation="vertical" className="mx-4" size="1" />

          <Button
            size="1"
            variant="surface"
            color={listOption === 'stable' ? 'green' : 'orange'}
            onClick={() => {
              changeList('stable')
            }}
          >
            stable
          </Button>
          <Button
            size="1"
            variant="surface"
            color={listOption === 'rand' ? 'green' : 'orange'}
            onClick={() => changeList('rand')}
          >
            random
          </Button>
        </div>
      </div>

      <div
        className="mx-auto mt-4 grid grid-flow-row-dense"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${colWidth}px, 1fr))`,
          gridAutoRows: `${colWidth}px`,
        }}
      >
        {theList.map((image, i) => {
          if (!image || !image?.storageUrl || i >= showLimit) return null
          const { width, height, storageUrl } = image

          const ar = width! / height!

          const naturalCol = ar > 1 ? 3 : 2
          const naturalRow = ar < 1 ? 3 : 2

          const gCol = naturalCol + icList[i]
          const rCol = naturalRow + irList[i]

          return (
            <Card
              key={image._id}
              className={cn('transition-all')}
              style={{ gridColumn: `span ${gCol} / span ${gCol}`, gridRow: `span ${rCol}` }}
            >
              <div className="absolute z-20 space-x-2 bg-blue-5A opacity-0 hover:opacity-100">
                <IconButton onClick={() => setIcList(icList.with(i, icList[i] - 1))} size="1">
                  C-
                </IconButton>
                <IconButton onClick={() => setIcList(icList.with(i, icList[i] + 1))} size="1">
                  C+
                </IconButton>
                {icList[i]} [ {i} ] {irList[i]}
                <IconButton onClick={() => setIrList(irList.with(i, irList[i] - 1))} size="1">
                  R-
                </IconButton>
                <IconButton onClick={() => setIrList(irList.with(i, irList[i] + 1))} size="1">
                  R+
                </IconButton>
                <Button
                  className="absolute right-1 top-1 hidden"
                  onClick={async () => await mRemove({ imageId: image._id! })}
                >
                  rm
                </Button>
              </div>

              <Img
                src={storageUrl}
                alt={ar.toString()}
                width={width}
                height={height}
                className="h-full w-full rounded-4 border border-transparent object-cover"
              />
            </Card>
          )
        })}
      </div>
    </div>
  )
}
