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
import { forwardRef, useRef, useState } from 'react'
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
    const messages = usePaginatedQuery(api.threads.read, threadId ? { id: threadId } : 'skip', {
      initialNumItems: 10,
    })
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

    const tempWaiting = false
    const titleBarIcon = tempWaiting
      ? MessageSquareMoreIcon
      : messages.results.length
        ? MessageSquareTextIcon
        : MessageSquareIcon

    return (
      <Shell.Root {...props} ref={forwardedRef}>
        <Shell.TitleBar icon={titleBarIcon}>Thread: {thread?.name}</Shell.TitleBar>

        <Shell.Content className="min-h-96">
          <div className="flex h-full flex-col justify-between gap-2">
            {/* messages */}
            <ScrollArea className="grow">
              <div className="flex flex-col justify-end divide-y">
                {messages.results.map((message) => (
                  <div key={message._id} className="p-2">
                    [{message.role}] {message.content}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* message input */}
            <div className="flex items-center gap-2">
              <TextArea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              <IconButton variant="surface" onClick={() => formRef.current?.requestSubmit()}>
                <SendIcon />
              </IconButton>
            </div>

            <DebugEntityInfo
              values={[thread?._id, `${messages.status} ${messages.results.length}`]}
            />
          </div>
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
