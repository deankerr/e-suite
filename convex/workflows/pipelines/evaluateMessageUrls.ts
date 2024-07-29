import fastContentTypeParse from 'fast-content-type-parse'
import * as vb from 'valibot'

import { internal } from '../../_generated/api'
import { fetch } from '../../lib/fetch'
import { jobErrorHandling } from '../engine'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

export type EvaluateMessageUrlsPipelineInput = vb.InferOutput<typeof InitialInput>

const InitialInput = vb.object({
  urls: vb.array(vb.string()),
  messageId: vb.pipe(
    vb.string(),
    vb.transform((input) => input as Id<'messages'>),
  ),
})

export const evaluateMessageUrlsPipeline: Pipeline = {
  name: 'evaluateMessageUrls',
  schema: InitialInput,
  steps: [
    {
      name: 'run',
      retryLimit: 3,
      action: async (ctx, input) => {
        return jobErrorHandling(async () => {
          const {
            initial: { urls, messageId },
          } = vb.parse(vb.object({ initial: InitialInput }), input)

          const urlData = await Promise.all(urls.map(fetchContentTypeData))

          const imageUrls = urlData
            .filter((data) => data.type.startsWith('image'))
            .map((data) => data.url)
          for (const url of imageUrls) {
            await ctx.runMutation(internal.workflows.jobs.createIngestImageUrlJob, {
              url,
              messageId,
            })
          }

          return { imageUrls }
        }, 'evaluateMessageUrls.run')
      },
    },
  ],
}

async function fetchContentTypeData(url: URL | string) {
  try {
    const response = await fetch.head(url.toString())

    const contentLength = parseInt(response.headers.get('content-length') || '0', 10)
    if (contentLength > 10 * 1024 * 1024) {
      // 10 MB limit
      throw new Error('Response too large')
    }

    const contentTypeHeader = response.headers.get('content-type')
    const { type, parameters } = fastContentTypeParse.parse(contentTypeHeader || '')
    return {
      url: url.toString(),
      type,
      parameters,
    }
  } catch (error) {
    console.error(`Error fetching content info for ${url.toString()}:`, error)
    return {
      url: url.toString(),
      type: 'unknown',
      parameters: {},
    }
  }
}
