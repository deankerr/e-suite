'use client'

import { useState } from 'react'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { AlertDialog, Button, Card, Heading, TextField } from '@radix-ui/themes'
import { Authenticated, Unauthenticated, useMutation, useQuery } from 'convex/react'
import { BookTextIcon, EarthIcon, LockIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { IconButton } from '@/components/ui/IconButton'
import { Logo } from '@/components/ui/Logo'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export default function ProfilePage() {
  const user = useQuery(api.users.getSelf, {})
  const threads = useQuery(api.threads.list, {})

  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadPublic, setNewThreadPublic] = useState(false)

  const createMutation = useMutation(api.threads.create)
  const createThread = () => {
    createMutation({
      title: newThreadTitle || undefined,
      permissions: {
        public: newThreadPublic,
      },
    })
      .then(() => toast.success('Thread created.'))
      .catch((err) => {
        console.error(err)
        if (err instanceof Error) toast.error(err.message)
        else toast.error('An unknown error occurred.')
      })
  }

  return (
    <div className="container min-h-full p-4">
      <Card>
        <div className="space-y-8 px-8 py-4">
          <div className="flex-between gap-6">
            <div className="flex items-center gap-3">
              <Logo className="size-12" />
              <span className="text-4xl">e/suite</span>
            </div>

            <div className="flex-center">
              <Unauthenticated>
                <SignInButton>Sign in</SignInButton>
              </Unauthenticated>
              <UserButton />
            </div>
          </div>

          <Authenticated>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded border p-4">
                <Heading>
                  {user?.name ?? 'User'} ({user?.role})
                </Heading>
                <div className="divide-y">
                  <div className="py-2 font-semibold">
                    user id
                    <div className="font-code text-sm text-gray-10">{user?._id}</div>
                  </div>
                  <div className="py-2 font-semibold">
                    api key<div className="font-code text-sm text-gray-10">{user?.apiKey}</div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 rounded border p-4">
                <Heading>Threads</Heading>
                <div className="space-y-2 py-2">
                  <div className="flex gap-2">
                    <div className="flex w-full shrink-0 items-center gap-2 rounded border px-2 py-2">
                      <IconButton
                        color={newThreadPublic ? 'sky' : undefined}
                        onClick={() => setNewThreadPublic(!newThreadPublic)}
                        className="transition-all"
                      >
                        {newThreadPublic ? <EarthIcon /> : <LockIcon />}
                      </IconButton>
                      <TextField.Root className="w-full">
                        <TextField.Input
                          placeholder="title"
                          value={newThreadTitle}
                          onChange={(e) => setNewThreadTitle(e.target.value)}
                        />
                      </TextField.Root>
                      <Button variant="surface" color="grass" onClick={createThread}>
                        create
                      </Button>
                    </div>
                  </div>
                  {threads?.map((thread) => {
                      if(!thread) return null
                    return <div key={thread._id} className="flex gap-2">
                      <div className="flex-center shrink-0 gap-2 rounded border px-4 py-2 text-center font-code text-sm text-gray-9">
                        <RemoveThreadDialog threadId={thread._id}>
                          <IconButton lucideIcon={Trash2Icon} color="red" />
                        </RemoveThreadDialog>

                        <div>
                          <div>[{thread.slug}]</div>
                          <div>{thread.permissions?.public ? 'public' : 'private'}</div>
                        </div>

                        <BookTextIcon />
                      </div>

                      <Link
                        href={`/t/${thread.slug}`}
                        className="flex w-full items-center rounded-4 border px-4 py-2"
                      >
                        {thread?.title ?? 'untitled thread'}
                      </Link>
                    </div>
                  })}
                </div>
              </div>
            </div>
          </Authenticated>
        </div>
      </Card>
    </div>
  )
}

type RemoveThreadDialogProps = { threadId: Id<'threads'> } & React.ComponentProps<'div'>

const RemoveThreadDialog = ({ threadId, children, ...props }: RemoveThreadDialogProps) => {
  const removeThread = useMutation(api.threads.remove)

  const send = () => {
    removeThread({ threadId })
      .then(() => toast.success('Thread deleted.'))
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
    <AlertDialog.Root {...props}>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>

      <AlertDialog.Content className="max-w-xs">
        <AlertDialog.Title>Delete Chat</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This insightful yet witty exchange will be gone forever.
        </AlertDialog.Description>

        <div className="mt-rx-4 flex justify-end gap-rx-3">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onClick={() => send()}>
            <Button variant="solid" color="red">
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
