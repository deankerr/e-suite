'use client'

import { generationSampleUrls } from '@/public/generations-sample/generationsSampleUrls'
import { Card, ScrollArea } from '@radix-ui/themes'
import Image from 'next/image'

type GenerationFeedProps = {
  props?: any
}

export const GenerationFeed = ({ props }: GenerationFeedProps) => {
  return (
    <ScrollArea className="dark:content-area-inset-shadow transition-all duration-300 md:mr-80">
      <div className="flex flex-col items-center gap-8 px-4 py-6">
        {generationSampleUrls.flatMap((url) => (
          <Card className="w-full max-w-3xl">
            <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
              {url.map((urlValue) => (
                <Image
                  key={urlValue}
                  src={'/generations-sample/' + urlValue}
                  alt="generation"
                  width={512}
                  height={512}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
