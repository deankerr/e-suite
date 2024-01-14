'use client'

import { Select } from '@/app/components/ui/Select'
import { api } from '@/convex/_generated/api'
import { ImageModel } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Badge, Card, colorProp, Heading, TextArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'
import Link from 'next/link'
import z from 'zod'

type BadgeColor = (typeof colorProp)['values'][number]
const typeBadgeColor: Record<string, BadgeColor> = {
  checkpoint: 'orange',
  lora: 'blue',
  unknown: 'grass',
}

const nsfwBadge: Record<string, BadgeColor> = {
  unclassified: 'crimson',
  safe: 'blue',
  low: 'violet',
  high: 'amber',
  x: 'ruby',
  true: 'ruby',
  false: 'violet',
}

export default function ImageModelsPage() {
  const imageModels = useQuery(api.imageModels.list)
  return (
    <div className="dark:bg-grid-dark relative grid overflow-auto [&_div]:col-start-1 [&_div]:row-start-1">
      <div className="mx-auto max-w-[98vw] space-y-8 rounded p-2">
        {imageModels?.map((model) => {
          // const [civitaiMain, versions] = parseCivitaiData(model.civitai)
          return (
            <div key={model._id} className="border-4 border-accent-8 p-6">
              <div className="flex gap-4">
                <ImageModelConfigCard model={model} />
                {/* <ImageProviderDataCard imageProvider={model.sinkin} /> */}
                {/* {civitaiMain} */}
              </div>
              {/* <div className="flex max-w-[99vw] gap-4 overflow-x-auto bg-gray-1A py-2">
                {...versions}
              </div> */}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type ImageModelConfigCardProps = {
  model: ImageModel
}

const ImageModelConfigCard = ({ model }: ImageModelConfigCardProps) => {
  return (
    <DataCard key={model._id}>
      <div className="space-y-2">
        <div className="font-mono text-xs text-gray-8">{model._id}</div>
        <Heading size="4">{model.name}</Heading>

        <Badge color={typeBadgeColor[model.type] ?? 'brown'}>{model.type}</Badge>
        <Badge color="bronze">{new Date(model._creationTime).toString().slice(0, 31)}</Badge>
        {model.civitaiId ? (
          <Link href={`https://civitai.com/models/${model.civitaiId}`}>
            <Badge>civitai: {model.civitaiId}</Badge>
          </Link>
        ) : null}
        <Badge color={nsfwBadge[model.nsfw]}>nsfw: {model.nsfw}</Badge>
        <Badge color="yellow">base: {model.base}</Badge>

        <div>
          <Heading size="3">Description</Heading>
          <TextArea className="h-24" defaultValue={model.description}></TextArea>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            base:
            <Select
              values={[['sd1.5'], ['sdxl'], ['dall-e'], ['unknown']]}
              defaultValue={model.base}
            />
          </div>
          <div className="flex items-center gap-2">
            nsfw:
            <Select
              values={[['unclassified'], ['safe'], ['low'], ['high'], ['x']]}
              defaultValue={model.nsfw}
            />
          </div>
          <div className="">tags: {model.tags}</div>
          <div className="flex items-center gap-2">
            hidden:
            <Select values={[['true'], ['false']]} defaultValue={String(model.hidden)} />
          </div>
        </div>

        <div>images</div>
      </div>
    </DataCard>
  )
}

// type ImageProviderDataCardProps = {
//   imageProvider?: ImageModelProvider | null
// }

// const ImageProviderDataCard = ({ imageProvider }: ImageProviderDataCardProps) => {
//   if (!imageProvider) return null
//   const { providerModelData: data } = imageProvider

//   return (
//     <DataCard>
//       <div className="space-y-2">
//         <div className="font-mono text-xs text-gray-8">{imageProvider._id}</div>
//         <Heading size="4">
//           {imageProvider.key} - {`"${data.name}"`}
//         </Heading>
//         <Badge>apiModelId: {imageProvider.providerModelId}</Badge>
//         <img src={data.cover_img} className="max-h-60" />
//         <pre className="font-mono overflow-x-auto bg-gray-1 text-xs">
//           {JSON.stringify({ ...data, tags: data.tags?.join() }, null, 2)}
//         </pre>
//       </div>
//     </DataCard>
//   )
// }

// const parseCivitaiData = (civitai?: CivitaiModelData | null): [JSX.Element, JSX.Element[]] => {
//   if (!civitai) return [<DataCard key="1" error="no civitai data" />, []]
//   const data = civitai.json ? (JSON.parse(civitai.json) as CivitaiModelDataJson) : null
//   if (!data)
//     return [
//       <DataCard
//         key="2"
//         id={civitai._id}
//         error={`no civitai model data json, error:${civitai.error}`}
//       />,
//       [],
//     ]

//   return [
//     <DataCard key={civitai._id}>
//       <div className="font-mono text-xs text-gray-8">{civitai._id}</div>
//       <Heading size="4">civitai - {`"${data.name}"`}</Heading>

//       <Badge color="bronze">{new Date(civitai.updatedAt).toString().slice(0, 31)}</Badge>
//       <Badge>civitaiId: {civitai.civitaiId}</Badge>
//       <Badge color={nsfwBadge[String(data.nsfw)]}>nsfw: {String(data.nsfw)}</Badge>
//       <Badge>type: {data.type}</Badge>
//       <pre className="font-mono max-h-96 overflow-x-auto bg-gray-1 text-xs">
//         {JSON.stringify(data, null, 2)}
//       </pre>
//     </DataCard>,

//     data.modelVersions.map((mv) => (
//       <DataCard key={mv.id}>
//         <Heading size="4">{mv.name}</Heading>
//         <Badge>base: {mv.baseModel}</Badge>
//         <Badge color="cyan">baseType: {mv.baseModelType}</Badge>
//         {mv.status !== 'Published' && <Badge color="sky">status: {mv.status}</Badge>}

//         <div className="flex gap-2 overflow-x-auto">
//           {mv.images.map((img) => (
//             <div key={img.url} className="flex-none border border-accent-6 p-2">
//               <img src={img.url} className="max-h-64" />
//               <Badge>
//                 {img.width} x {img.height}
//               </Badge>
//               <Badge color="pink">nsfw: {img.nsfw}</Badge>
//             </div>
//           ))}
//         </div>
//       </DataCard>
//     )),
//   ]
// }

type DataCardProps = {
  children?: React.ReactNode
  className?: TailwindClass
  error?: string
  id?: string
}

const DataCard = ({ children, className, id, error }: DataCardProps) => {
  return (
    <Card className={cn('w-96 flex-none', className)}>
      <div className="space-y-2">
        {id && <div className="font-mono text-xs text-gray-8">{id}</div>}
        {error && (
          <Heading size="3" color="red">
            {error}
          </Heading>
        )}
        {children}
      </div>
    </Card>
  )
}
