import { MessageFeed } from '@/app/(views)/chat/[thread_id]/MessageFeed'
import { Composer } from '@/components/composer/Composer'

export default function Page({ params }: { params: { thread_id: string } }) {
  return (
    <>
      <div className="grow">
        <MessageFeed slug={params.thread_id} />
      </div>
      <Composer />
    </>
  )
}
