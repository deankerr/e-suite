'use client'

import { Button } from '@/app/components/ui/Button'
import { IconButton } from '@/app/components/ui/IconButton'
import { Label } from '@/app/components/ui/Label'
import { Shell } from '@/app/components/ui/Shell'
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
import { PermissionsCard } from '../PermissionsCard'
import { DeleteThreadDialog } from './DeleteThreadDialog'
import { FormSchema, LlmParametersForm } from './LlmParametersForm'
import { Message } from './Message'

type Props = {
  threadId?: Id<'threads'>
  setTitle?: string
}

export const ThreadShell = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function ThreadShell({ setTitle, threadId, ...props }, forwardedRef) {
    const router = useRouter()
    const thread = useQuery(api.threads.do.get, threadId ? { id: threadId } : 'skip')
    const messages = useQuery(api.threads.do.tail, threadId ? { id: threadId } : 'skip')
    const updatePermissions = useMutation(api.threads.do.updatePermissions)

    const messagesIsLoading = threadId && !messages
    const systemPrompt = thread?.systemPrompt

    const sendMessage = useMutation(api.threads.do.send)
    const updateMessage = useMutation(api.threads.do.updateMessage)
    const removeMessage = useMutation(api.threads.do.removeMessage)

    const formRef = useRef<HTMLFormElement>(null)
    const [messageValue, setMessageValue] = useState('')
    const [nameValue, setNameValue] = useState('')
    const [systemPromptValue, setSystemPromptValue] = useState('')

    const handleSubmit = (values: FormSchema) => {
      const body: Parameters<typeof sendMessage>[0] = {
        threadId: threadId,
        systemPrompt: systemPromptValue,
        messages: [
          {
            role: 'user',
            name: nameSchema.parse(nameValue),
            content: messageSchema.parse(messageValue),
          },
          {
            role: 'assistant',
            content: '',
            inferenceParameters: values,
          },
        ],
      }

      console.log(body)

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
      if (name && nameValue !== name) setNameValue(name)
    }, [messages, nameValue])

    useEffect(() => {
      if (systemPrompt && systemPrompt !== systemPromptValue) {
        setSystemPromptValue(systemPrompt)
      }
    }, [systemPrompt, systemPromptValue, setSystemPromptValue])

    const tempWaiting = false
    const titleBarIcon = tempWaiting
      ? MessageSquareMoreIcon
      : messages?.length
        ? MessageSquareTextIcon
        : MessageSquareIcon

    return (
      <Shell.Root {...props} ref={forwardedRef}>
        <Shell.TitleBar icon={titleBarIcon}>
          {setTitle ? setTitle : thread?.name}
          <DebugEntityInfo values={[thread?._id, messages?.length]} />
        </Shell.TitleBar>

        <Shell.Content className="flex flex-col">
          {/* messages */}
          <ScrollArea className="grow">
            <div className="flex flex-col justify-end divide-y">
              {messages?.map((message, i) => (
                <Message
                  key={message._id}
                  ref={messages.length - 1 === i ? latestMessageRef : undefined}
                  message={message}
                  onDelete={(id) => removeMessage({ id })}
                  onEdit={(values) => updateMessage(values)}
                />
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
              disabled={!thread?.owner.isViewer}
            />
            <IconButton
              variant="surface"
              disabled={!thread?.owner.isViewer || messageValue.length === 0}
              onClick={handleSubmitMessage}
            >
              <SendIcon />
            </IconButton>
          </div>
        </Shell.Content>

        <Shell.Controls>
          <Button asChild>
            <Link href={`/thread/${threadId}`}>Link</Link>
          </Button>

          {thread?.owner.isViewer && (
            <DeleteThreadDialog id={threadId}>
              <Button color="red" disabled={!threadId}>
                Delete
              </Button>
            </DeleteThreadDialog>
          )}
        </Shell.Controls>

        <Shell.Sidebar>
          <div className="flex flex-col gap-1.5 p-3">
            {thread?.owner.isViewer && (
              <div className="pt-1">
                <PermissionsCard
                  permissions={thread.permissions}
                  onPermissionsChange={(permissions) =>
                    void updatePermissions({
                      id: thread._id,
                      permissions,
                    })
                  }
                />
              </div>
            )}

            <Label>System prompt</Label>
            <TextArea
              className="sm:text-sm"
              minRows={3}
              maxRows={6}
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
              initialValues={
                messages?.findLast((msg) => msg.inferenceParameters)?.inferenceParameters
              }
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
