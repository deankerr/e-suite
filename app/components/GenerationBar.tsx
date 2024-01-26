'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ImageModelResult } from '@/convex/types'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, TextArea } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { ImageModelPickerDialog } from './Shell/ImageModelPicker'
import { DimensionsToggle } from './ui/DimensionsToggle'
import { ImageModelCard } from './ui/ImageModelCard'

type GenerationBarProps = {
  show?: boolean
} & React.ComponentProps<'form'>

const formSchema = z.object({
  prompt: z.string().min(1),
  negativePrompt: z.string(),
  imageModelId: z
    .string()
    .min(1)
    .transform((v) => v as Id<'imageModels'>),
  dimensions: z.enum(['portrait', 'square', 'landscape']),
})

export const GenerationBar = ({ show, className, ...props }: GenerationBarProps) => {
  const createGeneration = useMutation(api.generations.create)

  const list = useQuery(api.imageModels.list, { type: 'checkpoint', take: 16 })
  const [imageModel, setImageModel] = useState<ImageModelResult>()

  const { register, control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      negativePrompt: '',
      dimensions: 'portrait',
      imageModelId: '',
    },
  })

  const submit = handleSubmit(
    async (data) => {
      console.log('submit', data)
      await createGeneration(data)
    },
    (errors) => console.log(errors),
  )

  return (
    <form className={cn('grid max-w-2xl gap-2 md:grid-cols-2')} onSubmit={submit} {...props}>
      <TextArea placeholder="what do you want to see?" className="" {...register('prompt')} />
      <TextArea
        placeholder="what do you not want to see?"
        className=""
        {...register('negativePrompt')}
      />

      <Controller
        name="imageModelId"
        control={control}
        render={({ field }) => (
          <ImageModelPickerDialog
            list={list}
            onValueChange={(value) => {
              setImageModel(value)
              field.onChange(value.imageModel._id)
            }}
            className="md:max-w-3xl"
          >
            <Button
              variant="outline"
              className="h-36 gap-1.5 overflow-hidden pl-0 text-center"
              size="1"
              {...field}
            >
              <ImageModelCard
                className="h-[100%] text-white after:rounded-none"
                from={imageModel}
              />
              {field.value ? 'Change Model' : 'Select Model'}
            </Button>
          </ImageModelPickerDialog>
        )}
      />

      <div className="flex flex-col justify-between gap-2">
        <Controller
          name="dimensions"
          control={control}
          render={({ field }) => (
            <DimensionsToggle
              type="single"
              {...field}
              onValueChange={(v) => {
                if (v) field.onChange(v)
              }}
            />
          )}
        />

        <Button variant="surface">Generate</Button>
      </div>
    </form>
  )
}
