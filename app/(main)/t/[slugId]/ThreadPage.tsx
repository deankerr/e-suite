'use client'

import { useMemo } from 'react'
import { AspectRatio, Button, Card, Heading, Inset, Select, TextField } from '@radix-ui/themes'
import { useMutation, usePaginatedQuery, useQueries, useQuery } from 'convex/react'
import { MessageSquareShareIcon, Trash2Icon } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { z } from 'zod'

import { IconButton } from '@/components/ui/IconButton'
import { api } from '@/convex/_generated/api'
import { generatedImagesFields, generationFields } from '@/convex/schema'

import type { ScheduledFunction } from '@/convex/types'

const thumbnailHeightRem = 16

const generationResponseSchema = z.record(
  z.string(),
  z
    .object({
      generation: z.object(generationFields).merge(z.object({ _id: z.string() })),
      generated_images: z
        .object(generatedImagesFields)
        .merge(z.object({ _id: z.string(), slugId: z.string() }))
        .array(),
    })
    .nullish(),
)

export default function ThreadPage({ slugId }: { slugId: string }) {
  const thread = useQuery(api.threads.getBySlugId, { slugId })
  const queryKey = thread ? { threadId: thread._id, order: 'desc' as const } : 'skip'
  const messages = usePaginatedQuery(api.messages.list, queryKey, { initialNumItems: 10 })

  const generationQueryKeys = useMemo(
    () =>
      Object.fromEntries(
        messages.results.map((message) => [
          message._id,
          {
            query: api.generation.getByMessageId,
            args: { messageId: message._id },
          },
        ]),
      ),
    [messages.results],
  )

  const generationQueries = useQueries(generationQueryKeys)
  const generations = generationResponseSchema.parse(generationQueries)

  const jobsQueryKeys = useMemo(
    () =>
      Object.fromEntries(
        messages.results.map((message) => [
          message._id,
          {
            query: api.jobs.getByMessageId,
            args: { messageId: message._id },
          },
        ]),
      ),
    [messages.results],
  )

  const jobsQueries = useQueries(jobsQueryKeys)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-redundant-type-constituents
  const jobs = jobsQueries as Record<string, ScheduledFunction[] | null | undefined>

  const createMessage = useMutation(api.messages.create)
  const createMessageFormAction = (formData: FormData) => {
    if (!thread) return

    const role = formData.get('role') as 'system' | 'assistant' | 'user'
    const name = formData.get('name') ? String(formData.get('name')) : undefined
    const content = formData.get('content') ? String(formData.get('content')) : ''
    console.log(role, name, content)

    createMessage({ threadId: thread?._id, message: { role, name, content } })
      .then(() => toast.success('Message created'))
      .catch((err) => {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Unknown error')
      })
  }

  const createGenerationFormAction = (formData: FormData) => {
    if (!thread) return

    const prompt = String(formData.get('prompt'))
    const negative_prompt = formData.get('negative_prompt')
      ? String(formData.get('negative_prompt'))
      : undefined
    const model_id = String(formData.get('model_id'))
    const width = Number(formData.get('width'))
    const height = Number(formData.get('height'))
    const n = Number(formData.get('amount'))
    const seed = formData.get('seed')
      ? Number(formData.get('amount'))
      : Math.floor(Math.random() * 10000000)

    createMessage({
      threadId: thread._id,
      message: {
        role: 'assistant',
      },
      generation: {
        provider: 'sinkin',
        prompt,
        negative_prompt,
        model_id,
        width,
        height,
        n,
        seed,
      },
    })
      .then(() => toast.success('Generation created'))
      .catch((err) => {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Unknown error')
      })
  }

  const removeMessage = useMutation(api.messages.remove)

  return (
    <div>
      <div className="grid gap-4 p-1 sm:grid-cols-[320px_1fr] sm:p-4">
        {/* quick create message */}
        <Card className="h-fit max-w-sm">
          <Heading size="2" className="mb-2">
            Create Message
          </Heading>
          <form className="space-y-2" action={createMessageFormAction}>
            <div className="grid grid-cols-2">
              <Select.Root defaultValue="user" name="role">
                <Select.Trigger />
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
            </div>

            <TextField.Root placeholder="content" className="grow" id="content" name="content" />

            <div className="flex-end">
              <Button variant="surface">Send</Button>
            </div>
          </form>

          <Heading size="2" className="mb-2 mt-3">
            Create generation
          </Heading>

          <form className="space-y-2" action={createGenerationFormAction}>
            <TextField.Root placeholder="prompt" id="prompt" name="prompt" />
            <TextField.Root
              placeholder="negative prompt"
              id="negative_prompt"
              name="negative_prompt"
            />
            <TextField.Root placeholder="model id" id="model_id" name="model_id" />
            <TextField.Root placeholder="seed" id="seed" name="seed" />

            <div className="flex gap-2">
              <TextField.Root placeholder="width" id="width" name="width" />
              <TextField.Root placeholder="height" id="height" name="height" />
              <TextField.Root placeholder="amount" id="amount" name="amount" />
            </div>

            <div className="flex-end">
              <Button variant="surface">Send</Button>
            </div>
          </form>
        </Card>

        {/* messages list */}
        <div className="space-y-4">
          {messages.results.map((message) => {
            const generation = generations[message._id]
            const genJobs = jobs[message._id]
            const latestJob = Array.isArray(genJobs) ? genJobs.at(-1) : undefined
            const latestStatus = latestJob?.state.kind ?? 'unknown'
            return (
              <div key={message._id} className="flex gap-4">
                <Card variant="classic" className="w-full max-w-5xl">
                  <div className="space-y-3">
                    {/* top bar */}
                    <Inset side="top">
                      <div className="items-end border-b border-gray-6 bg-grayA-2 p-2.5 flex-between">
                        <div className="gap-2 text-sm flex-start">
                          <Link href={`/m/${message.slugId}`}>
                            <MessageSquareShareIcon className="size-5" />
                          </Link>
                          {message.name && <Heading size="2">{message.name}</Heading>}
                          <span className="font-mono font-medium text-gray-11">{message.role}</span>
                        </div>

                        <div className="gap-2 text-gray-11 flex-end">
                          <div className="font-mono text-xs">
                            {latestStatus} {genJobs?.length}
                          </div>
                          <IconButton
                            label="remove message"
                            color="red"
                            size="1"
                            onClick={() => {
                              removeMessage({ messageId: message._id })
                                .then(() => toast.success('Message removed'))
                                .catch((err) => {
                                  if (err instanceof Error) toast.error(err.message)
                                  else toast.error('Unknown error')
                                })
                            }}
                          >
                            <Trash2Icon className="size-4 stroke-[1.5]" />
                          </IconButton>
                        </div>
                      </div>
                    </Inset>

                    {/* content */}
                    <div className="flex items-center gap-1 overflow-x-auto py-2">
                      {/* text */}
                      {message.content}

                      {/* generated images */}
                      {generation?.generated_images.map((image) => {
                        const { width, height, blurDataUrl } = image
                        const heightRatio = thumbnailHeightRem / height
                        const adjustedWidth = heightRatio * width
                        const url = getImageUrl(image.slugId)
                        return (
                          <div
                            key={image._id}
                            className="shrink-0 overflow-hidden rounded-lg border border-gold-7"
                            style={{ width: `${adjustedWidth}rem` }}
                          >
                            <AspectRatio ratio={width / height}>
                              {url && (
                                <NextImage
                                  unoptimized
                                  src={url}
                                  alt=""
                                  placeholder={blurDataUrl ? 'blur' : 'empty'}
                                  blurDataURL={blurDataUrl}
                                  width={width}
                                  height={height}
                                  className="object-cover"
                                />
                              )}
                            </AspectRatio>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const getImageUrl = (fileId: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.cloud', '.site')
  const url = new URL('i', siteUrl)
  url.searchParams.set('id', fileId)

  return url.toString()
}
