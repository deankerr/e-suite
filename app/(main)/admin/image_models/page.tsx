'use client'

import { api } from '@/convex/_generated/api'
import { Card } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'
import z from 'zod'

export default function ImageModelsPage() {
  const models = useQuery(api.image_models.listAll)
  return (
    <div className="dark:bg-grid-dark relative grid overflow-hidden [&_div]:col-start-1 [&_div]:row-start-1">
      <div className="space-y-4 overflow-y-auto p-6">
        {models?.map((m) => {
          const { civit_data, images, ...main } = m
          const data = z
            .object({
              modelVersions: z.array(z.any()),
              base_models: z.array(z.string()),
            })
            .parse(civit_data?.cache)

          return (
            <Card key={m._id}>
              <pre className="text-xs">{JSON.stringify(main, null, 2)}</pre>
              <div className="flex w-[90vw] gap-2 overflow-x-auto p-4">
                {data.modelVersions.map((mv) => (
                  <pre
                    key={mv.id}
                    className="max-h-96 w-96 shrink-0 overflow-x-auto bg-black text-xs"
                  >
                    {JSON.stringify(mv, null, 2)}
                  </pre>
                ))}
              </div>
              <div className="flex w-[90vw] gap-2 overflow-x-auto p-4">
                {images.map((i) => (
                  <div key={i.hash} className="w-[450px] shrink-0 overflow-hidden">
                    <NextImage
                      width="450"
                      height={(i.height / i.width) * 450}
                      alt="img"
                      src={i.url}
                      className="shrink-0"
                    />
                    <pre className="overflow-x-auto bg-black p-1 text-xs">
                      {JSON.stringify(i, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

const civitaiModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  poi: z.boolean(),
  nsfw: z.boolean(),
  allowNoCredit: z.boolean(),
  allowCommercialUse: z.string(),
  allowDerivatives: z.boolean(),
  allowDifferentLicense: z.boolean(),
  stats: z.object({
    downloadCount: z.number(),
    favoriteCount: z.number(),
    commentCount: z.number(),
    ratingCount: z.number(),
    rating: z.number(),
    tippedAmountCount: z.number(),
  }),
  creator: z.object({ username: z.string(), image: z.string() }),
  tags: z.array(z.string()),
  modelVersions: z.array(
    z.object({
      id: z.number(),
      modelId: z.number(),
      name: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
      status: z.string(),
      publishedAt: z.string(),
      trainedWords: z.array(z.unknown()),
      baseModel: z.string(),
      baseModelType: z.string(),
      earlyAccessTimeFrame: z.number(),
      description: z.string().nullable(),
      vaeId: z.unknown(),
      stats: z.object({
        downloadCount: z.number(),
        ratingCount: z.number(),
        rating: z.number(),
      }),
      files: z.any(),
      images: z.array(
        z.object({
          url: z.string(),
          nsfw: z.string(),
          width: z.number(),
          height: z.number(),
          hash: z.string(),
          type: z.string(),
          metadata: z.any(),
          meta: z.any(),
        }),
      ),
      downloadUrl: z.string(),
    }),
  ),
})
