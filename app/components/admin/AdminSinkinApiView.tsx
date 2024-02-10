'use client'

import { ImageModelCard } from '@/app/components/generations/ImageModelCard'
import { api } from '@/convex/_generated/api'
import { modelBases, modelTypes, nsfwRatings } from '@/convex/constants'
import { ImageModelResult, ModelBase, ModelType, NsfwRatings } from '@/convex/types'
import { Button, Card, Inset, ScrollArea, TextArea, TextFieldInput } from '@radix-ui/themes'
import { useAction, useMutation, useQuery } from 'convex/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Select } from '../ui/Select'
import { Shell } from '../ui/Shell'

type SinkinModelListing = typeof api.providers.sinkin.getModelsApi._returnType
type SinkinApiModel = SinkinModelListing['models'][number]

export const AdminSinkinApiView = () => {
  const ims = useQuery(api.imageModels.list, { type: 'checkpoint' })

  const action = useAction(api.providers.sinkin.getModelsApi)
  const [result, setResult] = useState<SinkinModelListing | null>(null)

  useEffect(() => {
    if (!result) {
      action()
        .then((res) => setResult(res))
        .catch((err) => console.error(err))
    }
  }, [result, action])

  return (
    <Shell.Root>
      <Shell.TitleBar>API</Shell.TitleBar>
      <Shell.Controls>
        <Button
          onClick={() => {
            action()
              .then((res) => setResult(res))
              .catch((err) => console.error(err))
          }}
        >
          Load
        </Button>
      </Shell.Controls>

      <Shell.Content className="col-span-2">
        <ScrollArea>
          {result && (
            <div className="grid gap-2">
              {result.models.map((model) => {
                const currents = ims?.filter((im) => im.imageModel.sinkin?.refId === model.id)
                const current = currents?.at(0)
                return (
                  <div key={model.id} className="flex gap-2">
                    <Card className="h-36 w-96">
                      <div className="grid h-full grid-flow-col gap-1">
                        <Inset side="left" className="">
                          <img src={model.cover_img} className="max-w-24" />
                        </Inset>
                        <div className="divide-y text-xs text-gray-10">
                          <div className="text-sm">{model.name}</div>
                          <div className="font-code">{model.id}</div>
                          <div>civit: {model.civitai_model_id}</div>
                          <div>
                            <Link href={model.link}>{model.link}</Link>
                          </div>
                        </div>
                        <TextArea
                          placeholder="sinkin tags"
                          size="1"
                          defaultValue={model.tags?.join(', ')}
                          className="h-full"
                        />
                      </div>
                    </Card>

                    <ImageModelEditCard
                      sinkin={model}
                      type={'checkpoint'}
                      current={current}
                      className="h-36"
                    />

                    {currents?.map((c) => <ImageModelCard key={c.imageModel._id} from={c} />)}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </Shell.Content>
    </Shell.Root>
  )
}

type ImageModelForm = {
  name: string
  base: ModelBase
  type: ModelType
  nsfw: NsfwRatings
  civitaiId?: string
  huggingFaceId?: string
  tags: string
  order: number
  imageUrl: string
}

type ImageModelEditCardProps = {
  sinkin: SinkinApiModel
  type?: ModelType
  current?: ImageModelResult
} & React.ComponentProps<typeof Card>

const ImageModelEditCard = ({ sinkin, type, current, ...props }: ImageModelEditCardProps) => {
  const create = useMutation(api.imageModels.create)
  const update = useMutation(api.imageModels.update)
  const pull = useAction(api.files.images.pull)

  const currentVals = current
    ? {
        ...current.imageModel,
        tags: current.imageModel.tags.join(),
        imageUrl: current.image?.sourceUrl,
      }
    : undefined

  const { register, control, handleSubmit } = useForm<ImageModelForm>({
    defaultValues: {
      base: sinkin.name.includes('XL') ? 'sdxl' : 'sd1.5',
      type: type,
      nsfw: 'safe',
      order: 0,
      ...currentVals,
    },
  })

  const onSubmit = handleSubmit(async ({ imageUrl, ...values }, ev) => {
    const imageId = await pull({ url: imageUrl, nsfw: 'safe' })
    if (!imageId) return console.error('failed to get imageId')

    const fields = {
      ...values,
      imageId,
      description: current?.imageModel.description ?? '',
      tags: values.tags.split(','),
      sinkin: { refId: sinkin.id },
      huggingFaceId: values.huggingFaceId ? values.huggingFaceId : undefined,
      order: values.order ? Number(values.order) : 0,
    }

    const existing = current?.imageModel._id

    if (existing) {
      await update({ fields: { ...fields, _id: existing } })
      return console.log('done')
    }
    const id = await create({
      fields,
    })
    console.log('id', id)
  })

  return (
    <Card {...props}>
      <form className="grid h-full grid-flow-col gap-2 text-xs" onSubmit={void onSubmit}>
        <div>
          <TextArea placeholder="name" defaultValue={sinkin.name} size="1" {...register('name')} />
          <div className="flex items-center gap-1 text-xs">
            base:
            <Controller
              name="base"
              control={control}
              render={({ field }) => (
                <Select
                  values={modelBases.map((b) => [b])}
                  onValueChange={field.onChange}
                  size="1"
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            type:
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  values={modelTypes.map((b) => [b])}
                  size="1"
                  onValueChange={field.onChange}
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            nsfw:
            <Controller
              name="nsfw"
              control={control}
              render={({ field }) => (
                <Select
                  values={nsfwRatings.map((b) => [b])}
                  size="1"
                  onValueChange={field.onChange}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-xs">
            civitai:{' '}
            <TextFieldInput
              {...register('civitaiId')}
              placeholder="none"
              defaultValue={sinkin.civitai_model_id}
              size="1"
              className="w-16"
            />
            order:
            <TextFieldInput {...register('order')} placeholder="0" size="1" className="w-8" />
          </div>

          <div className="flex items-center gap-1 text-xs">
            hf:{' '}
            <TextFieldInput
              {...register('huggingFaceId')}
              placeholder="none"
              defaultValue={
                sinkin.link.includes('https://huggingface.co/')
                  ? sinkin.link.replace('https://huggingface.co/', '')
                  : undefined
              }
              size="1"
            />
          </div>

          <TextArea placeholder="tags" size="1" {...register('tags')} />
          <div className="flex items-center gap-1 text-xs">
            image:
            <TextFieldInput size="1" defaultValue={sinkin.cover_img} {...register('imageUrl')} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Button disabled={!!currentVals}>create</Button>
          <Button disabled={!currentVals}>update</Button>
        </div>
      </form>
    </Card>
  )
}
