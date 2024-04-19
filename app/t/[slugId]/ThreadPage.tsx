'use client'

import { UserButton } from '@clerk/nextjs'
import { PlusIcon } from '@radix-ui/react-icons'
import { Card, Heading, Select, Separator, TextField } from '@radix-ui/themes'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { ChevronLeftIcon, MessagesSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { IconButton } from '@/components/ui/IconButton'
import { api } from '@/convex/_generated/api'

export default function ThreadPage({ slugId }: { slugId: string }) {
  const thread = useQuery(api.threads.getBySlugId, { slugId })
  const queryKey = thread ? { threadId: thread._id } : 'skip'
  const messages = usePaginatedQuery(api.messages.list, queryKey, { initialNumItems: 10 })

  const createMessage = useMutation(api.messages.create)
  const formSubmit = (formdata: FormData) => {
    if (!thread) return

    const role = formdata.get('role') as 'system' | 'assistant' | 'user'
    const name = formdata.get('name') ? String(formdata.get('name')) : undefined
    const content = formdata.get('content') ? String(formdata.get('content')) : ''
    console.log(role, name, content)

    createMessage({ threadId: thread?._id, message: { role, name, content } })
      .then(() => toast.success('Message created'))
      .catch((err) => {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Unknown error')
      })
  }

  const removeMessage = useMutation(api.messages.remove)
  return (
    <div>
      {/* header */}
      <header className="grid h-14 grid-cols-2 px-2">
        {/* title */}
        <div className="flex items-center gap-2">
          <IconButton variant="ghost" asChild>
            <Link href={'/dashboard'}>
              <ChevronLeftIcon className="stroke-[1.5] text-gray-11" />
            </Link>
          </IconButton>
          <MessagesSquareIcon className="stroke-[1.5]" />
          {thread ? thread?.title ?? 'Untitled thread' : '...'}
        </div>

        <div className="flex items-center justify-end gap-2 pr-2">
          <UserButton />
        </div>
      </header>

      <div className="px-3">
        <Separator size="4" />
      </div>

      <div className="space-y-4 p-1 sm:p-4">
        {/* quick create message */}
        <Card className="max-w-sm">
          <Heading size="2" className="mb-2">
            Create Message
          </Heading>
          <form className="flex gap-2" action={formSubmit}>
            <Select.Root defaultValue="user" name="role">
              <Select.Trigger className="w-24" />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Role</Select.Label>
                  <Select.Item value="user">User</Select.Item>
                  <Select.Item value="assistant">AI</Select.Item>
                  <Select.Item value="system">System</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>

            <TextField.Root placeholder="name" className="" id="name" name="name" />
            <TextField.Root placeholder="content" className="grow" id="content" name="content" />
            <IconButton>
              <PlusIcon />
            </IconButton>
          </form>
        </Card>

        {/* messages list */}
        <div className="space-y-1">
          {messages.results.map((message) => {
            return (
              <Card key={message._id} className="max-w-2xl">
                {message.name ?? message.role}: {JSON.stringify(message.content)}
                <IconButton
                  color="red"
                  className="float-right"
                  onClick={() => {
                    removeMessage({ messageId: message._id })
                      .then(() => toast.success('Message removed'))
                      .catch((err) => {
                        if (err instanceof Error) toast.error(err.message)
                        else toast.error('Unknown error')
                      })
                  }}
                >
                  <Trash2Icon className="size-5 stroke-[1.5]" />
                </IconButton>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
