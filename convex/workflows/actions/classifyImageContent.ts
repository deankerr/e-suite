import ky from 'ky'
import * as vb from 'valibot'

import { ENV } from '../../lib/env'

import type { ActionCtx } from '../../_generated/server'

const Response = vb.object({
  image: vb.object({
    modelId: vb.string(),
    results: vb.array(
      vb.object({
        label: vb.string(),
        score: vb.number(),
      }),
    ),
  }),
  object: vb.object({
    modelId: vb.string(),
    results: vb.array(
      vb.object({
        label: vb.string(),
        score: vb.number(),
        box: vb.object({
          xmin: vb.number(),
          ymin: vb.number(),
          xmax: vb.number(),
          ymax: vb.number(),
        }),
      }),
    ),
  }),
})

export const classifyImageContent = async (ctx: ActionCtx, args: { url: string }) => {
  const response = await ky
    .get(ENV.WORKERS_IMAGE_CLASSIFICATION_URL, {
      headers: {
        Authorization: `Bearer ${ENV.WORKERS_API_KEY}`,
      },
      searchParams: {
        image: args.url,
      },
    })
    .json()

  return vb.parse(Response, response)
}
