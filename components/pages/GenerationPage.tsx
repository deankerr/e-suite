'use client'

import { Card } from '@radix-ui/themes'
import { ImageIcon } from 'lucide-react'

import { GenerationDataList } from '@/components/images/GenerationDataList'
import { GenerationImage } from '@/components/images/GenerationImage'
import { useGeneration } from '@/lib/queries'
import { PageHeader } from './PageHeader'

type ImagePageProps = {
  rid: string
}

export const GenerationPage = ({ rid }: ImagePageProps) => {
  const generation = useGeneration({ rid })

  const title = generation?.prompt

  return (
    <>
      <PageHeader icon={<ImageIcon className="size-5 stroke-[1.5]" />} title={title} />
      <div className="grid min-h-[calc(100vh-3.5rem)] grid-rows-[1fr_auto] gap-4 p-4 bg-dot-[#331E0B] md:grid-cols-[1fr_240px]">
        {generation && (
          <>
            <div className="grid content-center justify-items-center md:content-start">
              <GenerationImage
                enablePageLink={false}
                generation={generation}
                imageProps={{ priority: true }}
              />
            </div>

            <div>
              <Card>
                <GenerationDataList generations={[generation]} />
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  )
}
