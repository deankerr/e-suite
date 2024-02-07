'use client'

import { Shell } from '@/app/components/Shell/Shell'
import { TextArea } from '@/app/components/ui/TextArea'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@radix-ui/themes'
import { useMutation, usePaginatedQuery } from 'convex/react'
import { forwardRef, useRef, useState } from 'react'
import { toast } from 'sonner'
import { FormSchema, LlmParametersForm } from './LlmParametersForm'

type Props = {}

export const ThreadShell = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function ThreadShell({ className, ...props }, forwardedRef) {
    const [threadId, setThreadId] = useState<Id<'threads'>>()
    const thread = usePaginatedQuery(api.llm.threads.read, threadId ? { id: threadId } : 'skip', {
      initialNumItems: 10,
    })
    const send = useMutation(api.llm.threads.send)

    const formRef = useRef<HTMLFormElement>(null)
    const [messageContent, setMessageContent] = useState('')

    const handleSubmit = (values: FormSchema) => {
      const body = {
        threadId,
        messages: [{ role: 'user' as const, content: messageContent, llmParameters: values }],
      }
      send(body)
        .then((threadId) => setThreadId(threadId))
        .catch((error) => {
          console.error(error)
          if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error('An unknown error occurred.')
          }
        })
    }

    return (
      <Shell.Root {...props} ref={forwardedRef}>
        <Shell.TitleBar>Thread:</Shell.TitleBar>

        <Shell.Content className="min-h-96">
          <div className="flex h-full flex-col justify-between gap-2">
            {thread ? <pre className="text-xs">{JSON.stringify(thread, null, 2)}</pre> : 'empty'}

            <div className="flex flex-col divide-y">
              {thread &&
                thread.results.map((message) => (
                  <div key={message._id} className="p-2">
                    [{message.role}] {message.content}
                  </div>
                ))}
            </div>

            {/* /* ChatInput */}
            <div className="flex gap-2">
              <TextArea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              <Button variant="surface" onClick={() => formRef.current?.requestSubmit()}>
                send
              </Button>
            </div>
          </div>
        </Shell.Content>

        <Shell.Controls>
          <Button variant="outline">Action</Button>
          {/* <Button variant="outline" onClick={() => createApiKey()}>CreateKey</Button> */}

          {/* <DeleteGenerationDialog id={generation._id}>
          <Button variant="outline" color="red">
            Delete
          </Button>
        </DeleteGenerationDialog> */}
        </Shell.Controls>

        <Shell.Sidebar>
          <pre className="bg-black text-xs text-white">
            threadId: {threadId}
            {'\n'}
          </pre>

          <LlmParametersForm ref={formRef} onSubmitSuccess={handleSubmit} />
        </Shell.Sidebar>
      </Shell.Root>
    )
  },
)
