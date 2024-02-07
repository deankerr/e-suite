'use client'

import { Shell } from '@/app/components/Shell/Shell'
import { IconButton } from '@/app/components/ui/IconButton'
import { TextArea } from '@/app/components/ui/TextArea'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ScrollArea } from '@radix-ui/themes'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import {
  MessageSquareIcon,
  MessageSquareMoreIcon,
  MessageSquareTextIcon,
  SendIcon,
} from 'lucide-react'
import Link from 'next/link'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/Button'
import { DebugEntityInfo } from '../util/DebugEntityInfo'
import { FormSchema, LlmParametersForm } from './LlmParametersForm'

type Props = {
  threadId?: Id<'threads'>
}

export const ThreadShell = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function ThreadShell({ threadId: externalThreadId, ...props }, forwardedRef) {
    const [localThreadId, setLocalThreadId] = useState<Id<'threads'>>()
    const threadId = externalThreadId ?? localThreadId

    const thread = useQuery(api.threads.get, threadId ? { id: threadId } : 'skip')
    const messages = useQuery(api.threads.tail, threadId ? { id: threadId } : 'skip')
    const sendMessage = useMutation(api.threads.send)

    const formRef = useRef<HTMLFormElement>(null)
    const [messageContent, setMessageContent] = useState('')

    const handleSubmit = (values: FormSchema) => {
      console.log('main submit')
      const body = {
        threadId: threadId,
        messages: [{ role: 'user' as const, content: messageContent, llmParameters: values }],
      }

      sendMessage(body)
        .then((threadId) => {
          console.log(threadId)
          setLocalThreadId(threadId)
        })
        .catch((error) => {
          console.error(error)
          if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error('An unknown error occurred.')
          }
        })
    }

    const latestMessageRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      if (latestMessageRef.current) {
        latestMessageRef.current.scrollIntoView()
      }
    }, [messages?.length])

    const tempWaiting = false
    const titleBarIcon = tempWaiting
      ? MessageSquareMoreIcon
      : messages?.length
        ? MessageSquareTextIcon
        : MessageSquareIcon

    return (
      <Shell.Root {...props} ref={forwardedRef}>
        <Shell.TitleBar icon={titleBarIcon}>Thread: {thread?.name}</Shell.TitleBar>

        <Shell.Content className="flex flex-col">
          {/* messages */}
          <ScrollArea className="grow">
            <div className="flex flex-col justify-end divide-y">
              {messages?.map((message, i) => (
                <div
                  key={message._id}
                  className="p-2"
                  ref={messages.length - 1 === i ? latestMessageRef : undefined}
                >
                  {`<${message.role}>`} {message.content}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* message input */}
          <div className="flex items-center gap-2">
            <TextArea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
            <IconButton variant="surface" onClick={() => formRef.current?.requestSubmit()}>
              <SendIcon />
            </IconButton>
          </div>

          <DebugEntityInfo values={[thread?._id, messages?.length]} />
        </Shell.Content>

        <Shell.Controls>
          <Button asChild>
            <Link href={`/thread/${threadId}`}>Link</Link>
          </Button>
        </Shell.Controls>

        <Shell.Sidebar>
          <LlmParametersForm ref={formRef} onSubmitSuccess={handleSubmit} />
        </Shell.Sidebar>
      </Shell.Root>
    )
  },
)
