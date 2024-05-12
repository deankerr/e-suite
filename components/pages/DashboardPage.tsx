'use client'

import { Button, Card, Heading, IconButton, TextField } from '@radix-ui/themes'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'
import { MessagesSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { useDashboardTemp } from '@/lib/api'
import { PageHeader } from './PageHeader'

export const DashboardPage = () => {
  const { threads, createThread, removeThread } = useDashboardTemp()

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="flex flex-wrap gap-2 py-4">
        <AuthLoading>
          <Card className="h-fit w-80">Auth loading...</Card>
        </AuthLoading>

        <Unauthenticated>
          <Card className="h-fit w-80">Unauthenticated</Card>
        </Unauthenticated>

        <Authenticated>
          {threads && (
            <Card className="h-fit min-w-80 max-w-lg">
              <Heading size="4">Threads</Heading>

              <div className="divide-y">
                <form
                  className="flex gap-2 py-2"
                  action={(formData: FormData) => {
                    const title = String(formData.get('title') ?? '') || undefined
                    createThread({ title })
                      .then(() => toast.success('Thread created'))
                      .catch((err) =>
                        err instanceof Error
                          ? toast.error(err.message)
                          : toast.error('Unknown error'),
                      )
                  }}
                >
                  <TextField.Root className="w-full" placeholder="title" name="title" />
                  <Button variant="surface">create</Button>
                </form>

                {threads.map((thread) => (
                  <div key={thread._id} className="gap-2 py-2 flex-between">
                    <Link href={`/thread/${thread.rid}`}>
                      <MessagesSquareIcon className="size-6" />
                    </Link>

                    <Link href={`/thread/${thread.rid}`} className="grow truncate">
                      {thread?.title ?? 'Untitled thread'}
                    </Link>

                    <div>
                      <IconButton
                        variant="surface"
                        color="red"
                        onClick={() => {
                          removeThread({ threadId: thread._id })
                            .then(() => toast.success('Thread deleted'))
                            .catch((err) =>
                              err instanceof Error
                                ? toast.error(err.message)
                                : toast.error('Unknown error'),
                            )
                        }}
                      >
                        <Trash2Icon className="size-5" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </Authenticated>
      </div>
    </>
  )
}
