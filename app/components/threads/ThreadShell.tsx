'use client'

import { Shell } from '@/app/components/Shell/Shell'
import { Button } from '@/app/components/ui/Button'
import { IconButton } from '@/app/components/ui/IconButton'
import { Label } from '@/app/components/ui/Label'
import { TextArea } from '@/app/components/ui/TextArea'
import { DebugEntityInfo } from '@/app/components/util/DebugEntityInfo'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ScrollArea, TextFieldInput } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import {
  MessageSquareIcon,
  MessageSquareMoreIcon,
  MessageSquareTextIcon,
  SendIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { DeleteThreadDialog } from './DeleteThreadDialog'
import { FormSchema, LlmParametersForm } from './LlmParametersForm'

type Props = {
  threadId?: Id<'threads'>
  setTitle?: string
}

export const ThreadShell = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function ThreadShell({ setTitle, threadId, ...props }, forwardedRef) {
    const router = useRouter()
    const thread = useQuery(api.threads.get, threadId ? { id: threadId } : 'skip')
    const messages = useQuery(api.threads.tail, threadId ? { id: threadId } : 'skip')
    const sendMessage = useMutation(api.threads.send)
    const messagesIsLoading = threadId && !messages

    const formRef = useRef<HTMLFormElement>(null)
    const [messageValue, setMessageValue] = useState('')
    const [nameValue, setNameValue] = useState('')
    const [systemPromptValue, setSystemPromptValue] = useState('')

    const handleSubmit = (values: FormSchema) => {
      const body = {
        threadId: threadId,
        messages: [
          {
            role: 'user' as const,
            name: nameSchema.parse(nameValue),
            content: messageSchema.parse(messageValue),
          },
          {
            role: 'assistant' as const,
            content: '',
            llmParameters: values,
          },
        ],
      }

      sendMessage(body)
        .then((id) => {
          setMessageValue('')
          if (!threadId) router.push(`/thread/${id}`)
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

    const handleSubmitMessage = () => {
      if (!messageValue) return
      formRef.current?.requestSubmit()
    }

    const latestMessageRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      if (latestMessageRef.current) {
        latestMessageRef.current.scrollIntoView()
      }
      const name = messages?.findLast((msg) => msg.role === 'user' && msg.name)?.name
      if (name) setNameValue(name)
    }, [messages?.length])

    const tempWaiting = false
    const titleBarIcon = tempWaiting
      ? MessageSquareMoreIcon
      : messages?.length
        ? MessageSquareTextIcon
        : MessageSquareIcon

    return (
      <Shell.Root {...props} ref={forwardedRef}>
        <Shell.TitleBar icon={titleBarIcon}>{setTitle ? setTitle : thread?.name}</Shell.TitleBar>

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
                  {`<${message.role}${message.name ? `:${message.name}` : ''}>`} {message.content}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* message input */}
          <div className="flex items-center gap-2">
            <TextArea
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmitMessage()
                }
              }}
            />
            <IconButton
              variant="surface"
              disabled={messageValue.length === 0}
              onClick={handleSubmitMessage}
            >
              <SendIcon />
            </IconButton>
          </div>

          <DebugEntityInfo values={[thread?._id, messages?.length]} />
        </Shell.Content>

        <Shell.Controls>
          <Button asChild>
            <Link href={`/thread/${threadId}`}>Link</Link>
          </Button>

          <DeleteThreadDialog id={threadId}>
            <Button color="red" disabled={!threadId}>
              Delete
            </Button>
          </DeleteThreadDialog>
        </Shell.Controls>

        <Shell.Sidebar>
          <div className="flex flex-col gap-1.5 p-3">
            <Label>System prompt</Label>
            <TextArea
              minRows={3}
              value={systemPromptValue}
              onChange={(e) => setSystemPromptValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5 p-3">
            <Label>Name</Label>
            <TextFieldInput value={nameValue} onChange={(e) => setNameValue(e.target.value)} />
          </div>
          {!messagesIsLoading && (
            <LlmParametersForm
              ref={formRef}
              initialValues={messages?.findLast((msg) => msg.llmParameters)?.llmParameters}
              onSubmitSuccess={handleSubmit}
            />
          )}
        </Shell.Sidebar>
      </Shell.Root>
    )
  },
)

const nameSchema = z
  .string()
  .optional()
  .transform((v) => (v ? v.slice(0, 32) : undefined))

const messageSchema = z.string().min(1).max(20000)
