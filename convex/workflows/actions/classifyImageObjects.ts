import ky from 'ky'
import * as vb from 'valibot'

import { ENV } from '../../lib/env'
import { getErrorMessage } from '../../shared/utils'

const Response = vb.object({
  modelId: vb.string(),
  objects: vb.array(
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
})

export const classifyImageObjects = async (args: { url: string }) => {
  try {
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

    const result = vb.parse(Response, response)
    return {
      ...result,
      objects: result.objects.filter((obj) => obj.score >= 0.3).slice(0, 12),
    }
  } catch (err) {
    console.error(err)
    return { error: getErrorMessage(err) }
  }
}
