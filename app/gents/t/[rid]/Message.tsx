import { Button } from '@radix-ui/themes'

import { useGetMessageNaive, useSetMessageCache } from '@/app/gents/api'

import type { Id } from '@/convex/_generated/dataModel'
import type { Message as MessageEnt } from '@/convex/external'

type MessageProps = { message: MessageEnt }

export const Message = ({ message }: MessageProps) => {
  const { setCache } = useSetMessageCache(message)
  return (
    <div className="border p-2">
      {message.role} {message.name} {message.text}{' '}
      <Button onClick={() => setCache(message)}>set</Button>
    </div>
  )
}

type MessageFromIdProps = { messageId: Id<'messages'> }

export const MessageFromId = ({ messageId }: MessageFromIdProps) => {
  const message = useGetMessageNaive(messageId)

  if (message) return <Message message={message} />

  return <div className="border bg-red-4 p-2">loading</div>
}
