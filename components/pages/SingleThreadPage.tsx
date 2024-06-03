'use client'

import { ChatPanel } from '@/components/chat-panel/ChatPanel'

type SingleThreadPageProps = { threadIndex: [string] }

export const SingleThreadPage = ({ threadIndex }: SingleThreadPageProps) => {
  return <ChatPanel threadId={threadIndex[0]} className="w-full" />
}
