'use client'

import { ImageModelCard } from '@/app/components/card/ImageModelCard'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ImageModelResult } from '@/convex/types'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Label from '@radix-ui/react-label'
import { Button, Card, Checkbox, TextArea } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import { forwardRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { ImageModelPickerDialog } from '../card/ImageModelPickerDialog'
import { DimensionsToggle } from '../ui/DimensionsToggle'

const formSchema = z.object({
  prompt: z.string().min(1),
  negativePrompt: z.string(),
  imageModelId: z
    .string()
    .min(1)
    .transform((v) => v as Id<'imageModels'>),
  dimensions: z.enum(['portrait', 'square', 'landscape']),
  randomize: z
    .union([z.literal('indeterminate'), z.boolean()])
    .transform((v) => (v === 'indeterminate' ? false : v)),
})

type GenerationBarProps = {} & React.ComponentProps<'form'>

export const GenerationForm = forwardRef<HTMLFormElement, GenerationBarProps>(
  function GenerationForm(props, forwardedRef) {
    const list = useQuery(api.imageModels.list, { type: 'checkpoint', take: 64 })

    const createGeneration = useMutation(api.generations.create)

    const [imageModel, setImageModel] = useState<ImageModelResult>()

    const { register, control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        prompt: '',
        negativePrompt: '',
        dimensions: 'portrait',
        imageModelId: '',
        randomize: false,
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

          toast.error('An unknown error occurred', {
            position: 'top-center',
          })
        }
      },
      (errors) => console.log(errors),
    )

    const labelCn = 'text-xs sr-only'

    return (
      <form onSubmit={(e) => void submit(e)} {...props} ref={forwardedRef}>
        <div>
          <Label.Root className={cn(labelCn)} htmlFor="prompt">
            Prompt
          </Label.Root>
          <TextArea size="3" placeholder="what do you want to see?" {...register('prompt')} />
        </div>

        <div>
          <Label.Root className={cn(labelCn)} htmlFor="negativePrompt">
            Negative prompt
          </Label.Root>
          <TextArea
            size="3"
            placeholder="what do you not want to see?"
            {...register('negativePrompt')}
          />
        </div>

        <div>
          <Label.Root className={cn(labelCn)} htmlFor="imageModelId">
            Model
          </Label.Root>
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
                className="max-w-[90vw]"
              >
                {field.value ? (
                  <ImageModelCard from={imageModel} className="mx-auto cursor-pointer" />
                ) : (
                  <Card
                    asChild
                    className="mx-auto grid h-32 w-72 cursor-pointer place-content-center text-sm"
                  >
                    <button>Select a model</button>
                  </Card>
                )}
              </ImageModelPickerDialog>
            )}
          />

          <div className="flex items-center gap-2">
            <Label.Root className={cn(labelCn, 'not-sr-only')} htmlFor="randomModel">
              randomize
            </Label.Root>
            <Controller
              name="randomize"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Checkbox {...rest} checked={value} onCheckedChange={(v) => onChange(v)} />
              )}
            />
          </div>
        </div>

        <div className="">
          <Label.Root className={cn(labelCn)} htmlFor="dimensions">
            Image dimensions
          </Label.Root>
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
        </div>
        <Button variant="surface" size="3">
          Generate
        </Button>
      </form>
    )
  },
)

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
