import { Chat } from '@/components/chat/Chat'
import { MessageFeed } from '@/components/chat/MessageFeed'

export default function Page() {
  return (
    <>
      <Chat threadId={'new'}>
        <div className="grow">
          <MessageFeed threadId={'new'} />
        </div>
      </Chat>
    </>
  )
}
