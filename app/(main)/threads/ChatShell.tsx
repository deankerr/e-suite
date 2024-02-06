'use client'

import { Shell } from '@/app/components/Shell/Shell'
import { Label } from '@/app/components/ui/Label'
import { TextArea } from '@/app/components/ui/TextArea'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Select, Slider } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { forwardRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  model: z.string().min(1),
  max_tokens: z.number().min(1).max(2048).step(1),
  temperature: z.number().min(0).max(2).step(0.1),
  top_p: z.number().min(0).max(1).step(0.1),
  top_k: z.number().min(1).max(100).step(1),
  repetition_penalty: z.number().min(1).max(2).step(0.01),
})

type Props = {}

export const ChatShell = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function ChatShell({ className, ...props }, forwardedRef) {
    const [threadId, setThreadId] = useState('')
    const textModels = useQuery(api.text.models.list)
    const thread = useQuery(api.llm.threads.handle, threadId ? { id: threadId } : 'skip')
    const send = useMutation(api.llm.threads.nsend)

    const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
      },
    })

    const submit = void handleSubmit(
      (data) => {
        console.log('submit', data)
        setFData(data)
      },
      (errors) => {
        console.error(errors)
        setFData(errors)
      },
    )

    const [fData, setFData] = useState<object | null>(null)
    const [messageContent, setMessageContent] = useState('')

    const messageSubmit = async () => {
      const id = await send({ threadId, message: messageContent })
      if (threadId !== id) setThreadId(id)
    }

    return (
      <Shell.Root {...props} className={cn('', className)} ref={forwardedRef}>
        <Shell.TitleBar>Untitled chat</Shell.TitleBar>

        <Shell.Content className="min-h-96">
          <div className="flex h-full flex-col justify-between gap-2">
            {fData ? <pre className="text-xs">{JSON.stringify(fData, null, 2)}</pre> : 'empty'}
            {thread?.messages.map((message) => (
              <div key={message._id}>
                {message.role}: {message.content}
              </div>
            ))}

            {/* /* ChatInput */}
            <div className="flex gap-2">
              <TextArea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              <Button variant="surface" onClick={void messageSubmit}>
                send
              </Button>
            </div>
          </div>
        </Shell.Content>

        <Shell.Controls>
          <Button variant="outline">Action</Button>
          {/* <Button variant="outline" onClick={() => createApiKey()}>CreateKey</Button> */}

          {/* <DeleteGenerationDialog id={generation._id}>
          <Button variant="outline" color="red">
            Delete
          </Button>
        </DeleteGenerationDialog> */}
        </Shell.Controls>

        <Shell.Sidebar>
          <pre className="bg-black text-xs text-white">
            threadId: {threadId}
            {'\n'}
            thread: {thread?._id}
            {'\n'}
            msg: {thread?.messages.length}
          </pre>

          <form onSubmit={submit}>
            <Controller
              name="model"
              control={control}
              render={({ field: { value, onChange, ref, ...fieldProps } }) => (
                <div className="flex flex-col gap-1 p-3">
                  <Label htmlFor="model">Model</Label>
                  <Select.Root {...fieldProps} value={value} onValueChange={(v) => onChange(v)}>
                    <Select.Trigger placeholder="Select a model" ref={ref} />
                    <Select.Content>
                      {textModels && (
                        <>
                          <Select.Group>
                            <Select.Label>Chat</Select.Label>
                            {textModels.chat.map((model) => (
                              <Select.Item key={model.reference} value={model.reference}>
                                {model.name}
                              </Select.Item>
                            ))}
                          </Select.Group>
                          <Select.Separator />
                          <Select.Group>
                            <Select.Label>Completion</Select.Label>
                            {textModels.completion.map((model) => (
                              <Select.Item key={model.reference} value={model.reference}>
                                {model.name}
                              </Select.Item>
                            ))}
                          </Select.Group>
                        </>
                      )}
                    </Select.Content>
                  </Select.Root>
                </div>
              )}
            />

            <Controller
              name="max_tokens"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <div className="flex flex-col gap-1.5 p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max_tokens">Max tokens</Label>
                    <div className="text-sm">{value}</div>
                  </div>
                  <Slider
                    {...fieldProps}
                    min={1}
                    max={2048}
                    value={[value]}
                    onValueChange={([v]) => onChange(v)}
                    className="cursor-pointer"
                  />
                </div>
              )}
            />

            <Controller
              name="temperature"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <div className="flex flex-col gap-1.5 p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">Temperature</Label>
                    <div className="text-sm">{value}</div>
                  </div>
                  <Slider
                    {...fieldProps}
                    min={0}
                    max={2}
                    step={0.1}
                    value={[value]}
                    onValueChange={([v]) => onChange(v)}
                    className="cursor-pointer"
                  />
                </div>
              )}
            />

            <Controller
              name="top_p"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <div className="flex flex-col gap-1.5 p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="top_p">Top-P</Label>
                    <div className="text-sm">{value}</div>
                  </div>
                  <Slider
                    {...fieldProps}
                    min={0}
                    max={1}
                    step={0.1}
                    value={[value]}
                    onValueChange={([v]) => onChange(v)}
                    className="cursor-pointer"
                  />
                </div>
              )}
            />

            <Controller
              name="top_k"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <div className="flex flex-col gap-1.5 p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="top_k">Top-K</Label>
                    <div className="text-sm">{value}</div>
                  </div>
                  <Slider
                    {...fieldProps}
                    min={1}
                    max={100}
                    step={1}
                    value={[value]}
                    onValueChange={([v]) => onChange(v)}
                    className="cursor-pointer"
                  />
                </div>
              )}
            />

            <Controller
              name="repetition_penalty"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <div className="flex flex-col gap-1.5 p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="repetition_penalty">Repetition penalty</Label>
                    <div className="text-sm">{value}</div>
                  </div>
                  <Slider
                    {...fieldProps}
                    min={1}
                    max={2}
                    step={0.01}
                    value={[value]}
                    onValueChange={([v]) => onChange(v)}
                    className="cursor-pointer"
                  />
                </div>
              )}
            />
          </form>
        </Shell.Sidebar>
      </Shell.Root>
    )
  },
)
