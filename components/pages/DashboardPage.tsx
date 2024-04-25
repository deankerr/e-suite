'use client'

import {
  Badge,
  Button,
  Card,
  Code,
  DataList,
  Heading,
  IconButton,
  TextField,
} from '@radix-ui/themes'
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from 'convex/react'
import { LayoutGridIcon, MessagesSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { PageWrapper } from './PageWrapper'

type DashboardPageProps = { props?: unknown }

export const DashboardPage = ({}: DashboardPageProps) => {
  const user = useQuery(api.users.getSelf, {})
  const threads = useQuery(api.threads.list, {})
  const createThread = useMutation(api.threads.create)
  const removeThread = useMutation(api.threads.remove)

  return (
    <PageWrapper icon={<LayoutGridIcon />} title={'Dashboard'}>
      <div className="flex flex-wrap gap-2 py-4">
        <AuthLoading>
          <Card className="h-fit w-80">Auth loading...</Card>
        </AuthLoading>

        <Unauthenticated>
          <Card className="h-fit w-80">Unauthenticated</Card>
        </Unauthenticated>

        <Authenticated>
          {user && (
            <Card className="h-fit w-80">
              <Heading size="4" mb="4">
                {user.name}
              </Heading>
              <DataList.Root orientation="horizontal">
                <DataList.Item>
                  <DataList.Label minWidth="64px">Role</DataList.Label>
                  <DataList.Value>
                    <Badge>{user.role}</Badge>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="64px">API Key</DataList.Label>
                  <DataList.Value>
                    <Code>{user.apiKey}</Code>
                  </DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Card>
          )}

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
    </PageWrapper>
  )
}
