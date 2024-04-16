'use client'

import { AlertDialog, AspectRatio, Button, Separator, Table } from '@radix-ui/themes'
import { Preloaded, useMutation, usePreloadedQuery, useQuery } from 'convex/react'
import {
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
  ImagesIcon,
  InfoIcon,
  MessageSquareIcon,
  MessagesSquareIcon,
  Trash2Icon,
} from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

import { IconButton } from '@/components/ui/IconButton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Message } from '@/convex/messages'
import { GenerationInference } from '@/convex/schema'
import { cn } from '@/lib/utils'

const thumbnailHeightRem = 14

type ThreadViewProps = {
  slug?: string
  preloadedThread: Preloaded<typeof api.threads.getBySlug>
  preloadedMessages: Preloaded<typeof api.messages.list>
} & React.ComponentProps<'div'>

export const ThreadView = ({ preloadedThread, preloadedMessages, ...props }: ThreadViewProps) => {
  const thread = usePreloadedQuery(preloadedThread)
  const title = thread.title ?? 'Untitled Thread'

  const messages = usePreloadedQuery(preloadedMessages)
  const textToImageMessages = messages?.filter((msg) => msg.inference?.type === 'textToImage')

  return (
    <div className={cn('', props.className)}>
      {/* header */}
      <div className="flex gap-2 px-2 py-4">
        <Link href={'/profile'}>
          <ChevronLeftIcon className="stroke-[1.5] text-gray-11" />
        </Link>

        <MessagesSquareIcon />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="px-3">
        <Separator size="4" />
      </div>

      {/* table */}
      <div className="px-3 py-4">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <InfoIcon className="mx-auto size-5" />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Byline</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {textToImageMessages.map((message) => {
              if (
                !message.content ||
                typeof message.content === 'string' ||
                message.inference?.type !== 'textToImage'
              )
                return null
              const imageIds = message.content.map(({ imageId }) => imageId)
              const generation = message.inference
              return (
                <MessageDetailRow
                  key={message._id}
                  message={message}
                  generation={generation}
                  imageIds={imageIds}
                />
              )
            })}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  )
}

type MessageDetailRowProps = {
  message: Message
  generation: GenerationInference
  imageIds: Id<'images'>[]
}

export const MessageDetailRow = ({ message, generation, imageIds }: MessageDetailRowProps) => {
  const images = useQuery(api.files.images.getMany, { imageIds })

  return (
    <>
      <Table.Row>
        <Table.RowHeaderCell>
          <Link href={`/m/${message.slug}`} className="flex-center mx-auto h-full gap-2">
            <MessageSquareIcon className="size-5 stroke-[1.5]" />
            <ImagesIcon className="size-5 stroke-[1.5]" />
          </Link>
        </Table.RowHeaderCell>
        <Table.Cell>
          <Link href={`/m/${message.slug}`}>{generation.title}</Link>
        </Table.Cell>
        <Table.Cell>{generation.byline}</Table.Cell>
        <Table.Cell>
          <div className="flex gap-2">
            <IconButton color="grass" size="2" variant="surface">
              {message.permissions?.public ? (
                <EyeIcon className="mx-auto size-5 stroke-[1.5]" />
              ) : (
                <EyeOffIcon className="mx-auto size-5 stroke-[1.5]" />
              )}
            </IconButton>

            <RemoveMessageDialog messageId={message._id}>
              <IconButton color="red" size="2" variant="soft">
                <Trash2Icon className="size-5 stroke-[1.5]" />
              </IconButton>
            </RemoveMessageDialog>
          </div>
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell colSpan={5}>
          <div className="flex items-center gap-1">
            {images?.map((image, i) => {
              if (!image)
                return (
                  <div key={i} className="h-10 w-10 bg-red-5">
                    ?
                  </div>
                )

              const { width, height, storageUrl, blurDataURL } = image

              const heightRatio = thumbnailHeightRem / height
              const adjustedWidth = heightRatio * width

              const url =
                storageUrl ??
                `https://placehold.co/${Math.floor(width / 2)}x${Math.floor(height / 2)}?text=esuite`
              return (
                <div
                  key={image?._id}
                  className={cn(
                    'overflow-hidden rounded-lg border border-gold-7 hover:border-gold-8',
                  )}
                  style={{ width: `${adjustedWidth}rem` }}
                >
                  <AspectRatio ratio={width / height}>
                    {url && (
                      <NextImage
                        unoptimized
                        src={url}
                        alt=""
                        placeholder={blurDataURL ? 'blur' : 'empty'}
                        blurDataURL={blurDataURL}
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
        </Table.Cell>
      </Table.Row>
    </>
  )
}

type RemoveMessageDialogProps = { messageId: Id<'messages'> } & React.ComponentProps<'div'>

const RemoveMessageDialog = ({ messageId, children, ...props }: RemoveMessageDialogProps) => {
  const removeMessage = useMutation(api.messages.remove)

  const send = () => {
    removeMessage({ messageId })
      .then(() => toast.success('Message deleted.'))
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
        <AlertDialog.Title>Delete message</AlertDialog.Title>
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
