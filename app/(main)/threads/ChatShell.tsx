'use client'

import { Shell } from '@/app/components/Shell/Shell'
import { Label } from '@/app/components/ui/Label'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Select, Slider } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { forwardRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  textModel: z.string().min(1),
  maxTokens: z.number().min(1).max(2048).step(1),
  temperature: z.number().min(0).max(2).step(0.1),
  topP: z.number().min(0).max(1).step(0.1),
  topK: z.number().min(1).max(100).step(1),
  repetitionPenalty: z.number().min(1).max(2).step(0.01),
})

type Props = {}

export const ChatShell = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function ChatShell({ className, ...props }, forwardedRef) {
    const textModels = useQuery(api.text.models.list)

    const { control, handleSubmit, register } = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        textModel: 'a',
        maxTokens: 512,
        temperature: 0.7,
        topP: 0.7,
        topK: 50,
        repetitionPenalty: 1,
      },
    })

    const submit = handleSubmit(
      async (data) => {
        console.log('submit', data)
        setFData(data)
      },
      (errors) => {
        console.error(errors)
        setFData(errors)
      },
    )

    const [fData, setFData] = useState<object | null>(null)

    return (
      <Shell.Root {...props} className={cn('', className)} ref={forwardedRef}>
        <Shell.TitleBar>Untitled chat</Shell.TitleBar>

        <Shell.Content className="min-h-96">
          {fData ? <pre>{JSON.stringify(fData, null, 2)}</pre> : 'empty'}
        </Shell.Content>

        <Shell.Controls>
          <Button variant="outline">Action</Button>
          {/* <DeleteGenerationDialog id={generation._id}>
          <Button variant="outline" color="red">
            Delete
          </Button>
        </DeleteGenerationDialog> */}
        </Shell.Controls>

        <Shell.Sidebar>
          <form onSubmit={submit} className="">
            <div className="flex flex-col gap-1 p-3">
              <Label htmlFor="textModel">Model</Label>
              <Select.Root {...register('textModel')}>
                <Select.Trigger placeholder="Select a model" />
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

            <Controller
              name="maxTokens"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <div className="flex flex-col gap-1 p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maxTokens">Max tokens</Label>
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
                <div className="flex flex-col gap-1 p-3">
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
              name="topP"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <div className="flex flex-col gap-1 p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="topP">Top-P</Label>
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
              name="topK"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <div className="flex flex-col gap-1 p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="topK">Top-K</Label>
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
              name="repetitionPenalty"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <div className="flex flex-col gap-1 p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="repetitionPenalty">Repetition penalty</Label>
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

            <Button>Submitty</Button>
          </form>
        </Shell.Sidebar>
      </Shell.Root>
    )
  },
)
