'use client'

import { Button } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'
import Link from 'next/link'
import { Masonry } from 'react-masonry'

import { ImageThumb } from '@/components/ImageThumb'
import { api } from '@/convex/_generated/api'

export default function Page() {
  const pager = usePaginatedQuery(api.threads.imagefeed, {}, { initialNumItems: 10 })

  return (
    <div className="">
      <Masonry>
        {pager.results.map((gen, i) => {
          return (
            <Link
              key={gen.image._id}
              className="block w-1/3 px-2 py-2"
              href={`/a/image/${gen.image.slugId}`}
            >
              <ImageThumb
                image={gen.image}
                generation={gen.generation}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </Link>
          )
        })}
      </Masonry>

      <div>
        <Button onClick={() => pager.loadMore(20)}>load more</Button>
      </div>
    </div>
  )
}
