import { v } from 'convex/values'
import fastContentTypeParse from 'fast-content-type-parse'
import ky from 'ky'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'

export const run = internalAction({
  args: {
    urls: v.array(v.string()),
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const urlData = await Promise.all(args.urls.map(fetchContentTypeData))
    for (const url of urlData) {
      if (url.type.startsWith('image')) {
        try {
          await ctx.runMutation(internal.jobs.createJobM, {
            name: 'files/ingestImageUrl',
            fields: {
              url: url.url,
              messageId: args.messageId,
            },
          })
        } catch (error) {
          console.error(`Error creating job for ${url.url}:`, error)
        }
      }
    }
  },
})

async function fetchContentTypeData(url: URL | string) {
  try {
    const response = await ky(url.toString(), { method: 'HEAD' })
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
