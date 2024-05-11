'use client'

import { useMessage } from '@/app/gents/atoms'

export const MessageContentView = ({ rid }: { rid: string }) => {
  const { message, generations } = useMessage(rid)

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold tracking-tighter">
        {message.role} {message.name} {message.text}{' '}
      </h1>
      {generations?.map((gen) => <div key={gen._id}>{gen.prompt}</div>)}
    </div>
  )
}
