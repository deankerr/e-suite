'use client'

import { useState } from 'react'
import { Button, Card, Heading, Table, TextField } from '@radix-ui/themes'
import { Authenticated, useMutation, useQuery } from 'convex/react'
import { EyeIcon, EyeOffIcon, InfoIcon, MessagesSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { IconButton } from '@/components/ui/IconButton'
import { api } from '@/convex/_generated/api'

type DashboardPageProps = {
  props?: unknown
}

export const DashboardPage = ({}: DashboardPageProps) => {
  const user = useQuery(api.users.getSelf, {})
  const threads = useQuery(api.threads.list, {})

  const createThread = useMutation(api.threads.create)
  const [newThreadTitle, setNewThreadTitle] = useState('')

  const removeThread = useMutation(api.threads.remove)

  return (
    <div>
      <Authenticated>
        <div className="space-y-4 p-1 sm:p-4">
          {/* user info */}
          <Card className="max-w-sm">
            <Heading size="3">
              {user?.name ?? 'User'}{' '}
              <span className="font-mono text-sm font-medium text-gray-10">{user?.role}</span>
            </Heading>
            <div className="divide-y">
              <div className="py-1 text-sm">
                <div className="font-medium">user id</div>
                <div className="font-mono text-gray-10">{user?._id}</div>
              </div>
              <div className="py-1 text-sm">
                <div className="font-medium">api key</div>
                <div className="font-mono text-gray-10">{user?.apiKey}</div>
              </div>
            </div>
          </Card>

          {/* threads list */}
          <Table.Root variant="surface" className="max-w-lg">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>
                  <InfoIcon className="mx-auto size-5" />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {threads?.map((thread) => (
                <Table.Row key={thread._id}>
                  <Table.RowHeaderCell>
                    <div className="flex h-full items-center justify-center">
                      <MessagesSquareIcon className="size-5 stroke-[1.5]" />
                    </div>
                  </Table.RowHeaderCell>

                  <Table.Cell>
                    <div className="flex h-full items-center">
                      <Link href={`/t/${thread.slugId}`}>{thread.title ?? 'Untitled thread'}</Link>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <IconButton label="toggle visibility" color="grass" size="2" variant="surface">
                      {thread.permissions?.public ? (
                        <EyeIcon className="mx-auto size-5 stroke-[1.5]" />
                      ) : (
                        <EyeOffIcon className="mx-auto size-5 stroke-[1.5]" />
                      )}
                    </IconButton>
                    <IconButton
                      label="remove thread"
                      color="red"
                      size="2"
                      variant="surface"
                      onClick={() => {
                        removeThread({ threadId: thread._id })
                          .then(() => toast.success('Thread removed.'))
                          .catch(() => toast.error('Error removing thread'))
                      }}
                    >
                      <Trash2Icon className="size-5 stroke-[1.5]" />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* create thread */}
          <Card className="max-w-sm">
            <Heading size="2">Create Thread</Heading>
            <div className="flex items-center gap-2 py-2">
              <TextField.Root
                className="w-full"
                placeholder="title"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
              />
              <Button
                variant="surface"
                color="grass"
                onClick={() => {
                  createThread({ title: newThreadTitle || undefined })
                    .then(() => {
                      toast.success('Thread created.')
                      setNewThreadTitle('')
                    })
                    .catch(() => toast.error('Error creating thread'))
                }}
              >
                create
              </Button>
            </div>
          </Card>
        </div>
      </Authenticated>
    </div>
  )
}
