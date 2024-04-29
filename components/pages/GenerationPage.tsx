'use client'

import { Card } from '@radix-ui/themes'
import { ImageIcon } from 'lucide-react'

import { useTitle } from '@/lib/hooks'
import { useGeneration } from '@/lib/queries'
import { GenerationDataList } from '../GenerationDataList'
import { GenerationImage } from '../images/GenerationImage'
import { PageWrapper } from './PageWrapper'

type ImagePageProps = {
  rid: string
}

export const GenerationPage = ({ rid }: ImagePageProps) => {
  const generation = useGeneration({ rid })

  const title = generation?.prompt ?? 'Generation'
  useTitle(title)

  return (
    <PageWrapper icon={<ImageIcon />} title={title}>
      <div className="grid min-h-[calc(100vh-3.5rem)] grid-rows-[1fr_auto] gap-4 p-4 bg-dot-[#331E0B] md:grid-cols-[1fr_320px]">
        {generation && (
          <>
            <div className="grid content-start justify-items-center">
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
    </PageWrapper>
  )
}
