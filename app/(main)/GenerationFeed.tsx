'use client'

import { generationSampleUrls } from '@/public/generations-sample/generationsSampleUrls'
import { Card } from '@radix-ui/themes'
import Image from 'next/image'

type GenerationFeedProps = {
  props?: any
}

export const GenerationFeed = ({ props }: GenerationFeedProps) => {
  return (
    <div className="dark:content-area-inset-shadow flex flex-col items-center gap-8 overflow-y-auto px-4 py-6">
      {generationSampleUrls.map((urls, i) => (
        <Card key={i} className="w-full max-w-3xl">
          <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
            {urls.map((url) => (
              <Image
                key={url}
                src={'/generations-sample/' + url}
                alt="generation"
                width={512}
                height={512}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
