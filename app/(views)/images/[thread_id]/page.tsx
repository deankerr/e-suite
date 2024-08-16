import { ImagesFeed } from '@/app/(views)/images/[thread_id]/ImagesFeed'
import { Composer } from '@/components/composer/Composer'

export default function Page({ params }: { params: { thread_id: string } }) {
  return (
    <>
      <div className="h-96 grow overflow-hidden">
        <ImagesFeed thread_id={params.thread_id} />
      </div>
      <Composer />
    </>
  )
}
