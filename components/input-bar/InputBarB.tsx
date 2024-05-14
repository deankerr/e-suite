'use client'

import { IconButton, Inset, SegmentedControl } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import {
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SendHorizonalIcon,
  SquareIcon,
} from 'lucide-react'
import NextImage from 'next/image'
import TextareaAutosize from 'react-textarea-autosize'

import { useInputBarAtom } from '@/components/input-bar/atoms'
import { useSendMessage } from '@/components/input-bar/useSendMessage'
import { Glass } from '@/components/ui/Glass'
import { SelectList } from '@/components/ui/SelectList'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

type InputBarProps = { centered?: boolean }

export const InputBarB = ({ centered = false }: InputBarProps) => {
  const [inputBar, setInputBar] = useInputBarAtom()

  const chatModels = useQuery(api.models.listChatModels, {})
  const imageModels = useQuery(api.models.listImageModels, {})

  const sendMessage = useSendMessage()

  const currentChatModel = chatModels?.find((m) => m.model_id === inputBar.chatModel)
  const currentImageModel = imageModels?.find((m) => m.model_id === inputBar.imageModel)

  return (
    <motion.div
      className={cn(
        'fixed bottom-2 left-1/2 flex -translate-x-1/2 flex-col justify-center',
        'w-full max-w-3xl',
        'overflow-hidden rounded-[18px] border',
        centered && 'bottom-auto top-1/2 -translate-y-1/2',
      )}
    >
      <Glass barWidth={1} borderRadius={18} className="absolute inset-0" />
      <div className="min-h-12 p-4">
        <div className="rounded-lg bg-gray-2 p-3">
          <div className="flex flex-col gap-3 text-lg">
            <div className="flex items-end gap-2">
              <TextareaAutosize
                maxRows={10}
                placeholder="A bird in the bush is worth..."
                className="w-full resize-none bg-transparent p-1 text-gray-12 outline-none placeholder:text-gray-9"
                value={inputBar.prompt}
                onChange={(e) => setInputBar((o) => ({ ...o, prompt: e.target.value }))}
              />
              <div className="h-9 flex-end">
                <IconButton variant="ghost" size="2" onClick={() => void sendMessage()}>
                  <SendHorizonalIcon />
                </IconButton>
              </div>
            </div>

            <div className="flex-wrap gap-2 flex-between">
              <SegmentedControl.Root
                value={inputBar.mode}
                onValueChange={(value) =>
                  setInputBar((o) => ({ ...o, mode: value as 'chat' | 'image' }))
                }
              >
                <SegmentedControl.Item value="chat">Chat</SegmentedControl.Item>
                <SegmentedControl.Item value="image">Image</SegmentedControl.Item>
              </SegmentedControl.Root>

              {/* right */}
              <div className="flex gap-2">
                {inputBar.mode === 'image' && (
                  <>
                    {/* images inputs */}
                    <div className="grid gap-2">
                      <SegmentedControl.Root
                        value={inputBar.imageShape}
                        onValueChange={(v) => {
                          setInputBar((o) => ({
                            ...o,
                            imageShape: v as 'portrait' | 'square' | 'landscape',
                          }))
                        }}
                      >
                        <SegmentedControl.Item value="portrait">
                          <RectangleVerticalIcon className="size-4" />
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="square">
                          <SquareIcon className="size-4" />
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="landscape">
                          <RectangleHorizontalIcon className="size-4" />
                        </SegmentedControl.Item>
                      </SegmentedControl.Root>

                      {imageModels && (
                        <SelectList
                          items={imageModels.map(({ model_id, name }) => ({
                            value: model_id,
                            label: name,
                          }))}
                          value={inputBar.imageModel}
                          onValueChange={(value) =>
                            setInputBar((o) => ({ ...o, imageModel: value }))
                          }
                        />
                      )}
                    </div>

                    <MCard
                      title={currentImageModel?.name}
                      creator={currentImageModel?.provider}
                      image={currentImageModel?.image?._id}
                    />
                  </>
                )}

                {/* chat input */}
                {inputBar.mode === 'chat' && chatModels && (
                  <>
                    <div className="grid gap-2">
                      <div className="invisible w-20">
                        <SelectList
                          items={chatModels.map(({ model_id, name }) => ({
                            value: model_id,
                            label: name,
                          }))}
                          value={inputBar.chatModel}
                          onValueChange={(value) =>
                            setInputBar((o) => ({ ...o, chatModel: value }))
                          }
                        />
                      </div>
                      <div className="w-40">
                        <SelectList
                          items={chatModels.map(({ model_id, name }) => ({
                            value: model_id,
                            label: name,
                          }))}
                          value={inputBar.chatModel}
                          onValueChange={(value) =>
                            setInputBar((o) => ({ ...o, chatModel: value }))
                          }
                        />
                      </div>
                    </div>

                    <MCard
                      title={currentChatModel?.name}
                      creator={currentChatModel?.creatorName}
                      category={currentChatModel?.type}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

type MCardProps = {
  title?: string
  creator?: string
  category?: string
  image?: string
}

const MCard = ({ title, creator, category, image }: MCardProps) => {
  return (
    <div className="flex h-16 w-72 flex-col justify-between overflow-hidden rounded border p-2">
      {image && (
        <Inset side="right" className="absolute right-0 top-0 h-full w-16">
          <NextImage
            alt=""
            fill
            src={`/i/${image}`}
            sizes="64px"
            className="object-cover object-top"
          />
        </Inset>
      )}
      <div className="mr-16 gap-2 text-sm text-gray-11 flex-between">
        <div>{creator}</div>
        <div className="first-letter:uppercase">{category}</div>
      </div>
      <div className="line-clamp-1 text-base">{title}</div>
    </div>
  )
}
