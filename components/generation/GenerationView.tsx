import { Card } from '@radix-ui/themes'

import { GeneratedImageView } from '../images/GeneratedImageView'
import { GenerationDataList } from './GenerationDataList'

import type { Generation } from '@/convex/external'

type GenerationViewProps = { generation: Generation }

export const GenerationView = ({ generation }: GenerationViewProps) => {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] grid-rows-[1fr_auto] gap-4 p-4 md:grid-cols-[1fr_240px]">
      <div className="grid content-center justify-items-center md:content-start">
        <GeneratedImageView
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
    </div>
  )
}
