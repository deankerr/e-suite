'use client'

import { ImageIcon } from 'lucide-react'

import { GenerationView } from '@/components/generation/GenerationView'
// import { useGeneration } from '@/lib/queries'
import { PageHeader } from './PageHeader'

type ImagePageProps = {
  rid: string
}

export const GenerationPage = ({ rid }: ImagePageProps) => {
  // const generation = useGeneration({ rid })
  // const title = generation?.prompt

  return (
    <>
      <PageHeader icon={<ImageIcon className="size-5 stroke-[1.5]" />} title={'fix me'} />
      {/* {generation && <GenerationView generation={generation} />} */}
    </>
  )
}
