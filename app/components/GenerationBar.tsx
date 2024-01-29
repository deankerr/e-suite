'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ImageModelResult } from '@/convex/types'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, TextArea } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
  const list = useQuery(api.imageModels.list, { type: 'checkpoint', take: 16 })

  const createGeneration = useMutation(api.generations.create)
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
      try {
        await createGeneration(data)
      } catch (err) {
        console.error(err)
        if (err instanceof ConvexError) {
          const msg = err.data.message ?? err.message
          toast.error(msg as string, {
            position: 'top-center',
          })
          return
        }

        if (err instanceof Error) {
          toast.error(err.message, {
            position: 'top-center',
          })
          return
        }

        toast.error('An unknown error occured', {
          position: 'top-center',
        })
      }
    },
    (errors) => console.log(errors),
  )

  return (
    <form
      className={cn('grid max-w-2xl gap-2 md:grid-cols-2', !show && 'pointer-events-none')}
      onSubmit={submit}
      {...props}
    >
      <TextArea placeholder="what do you want to see?" className="" {...register('prompt')} />
      <TextArea placeholder="what do you not want to see?" {...register('negativePrompt')} />

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

/* 
  <div className={controlCn}>
          <Label.Root className={labelCn} htmlFor="steps">
            Steps
          </Label.Root>
          <Slider
            min={1}
            max={50}
            name="steps"
            value={steps}
            onValueChange={([v]) => setSteps([v!])}
          />
        </div>

        <div className={controlCn}>
          <Label.Root className={labelCn} htmlFor="scale">
            Guidance scale
          </Label.Root>
          <Slider
            min={1}
            max={20}
            step={0.5}
            name="scale"
            value={guidance}
            onValueChange={([v]) => setGuidance([v!])}
          />
        </div>

        const sinkinSchedulers = [
['DPMSolverMultistep'],
['K_EULER_ANCESTRAL'],
['DDIM'],
['K_EULER'],
['PNDM'],
['KLMS'],
] as const

<div className="flex flex-col gap-3 px-4">
      <Label.Root className="text-sm">LoRA</Label.Root>
      <div className="flex justify-between gap-2">
        <Button variant="outline" className="grow">
          Good Personalities v0.3
        </Button>
        <IconButton variant="surface">0.7</IconButton>
      </div>
      <div className="flex justify-between gap-2">
        <Button variant="outline" className="grow">
          Party Balloons v4
        </Button>
        <IconButton variant="surface">0.5</IconButton>
      </div>
      <div className="flex justify-between gap-2">
        <Button variant="outline" className="grow">
          Hands Are Cheeses
        </Button>
        <IconButton variant="surface">0.3</IconButton>
      </div>
      <div className="flex justify-between gap-2">
        <Button variant="outline" className="grow">
          No Birds v1.4
        </Button>
        <IconButton variant="surface">0.5</IconButton>
      </div>
    </div>
*/
