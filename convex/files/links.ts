import { v } from 'convex/values'
import fastContentTypeParse from 'fast-content-type-parse'
import ky from 'ky'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'

interface ContentInfo {
  url: string
  type: string
  parameters: Record<string, string>
  isImage: boolean
}

export async function analyzeUrls(text: string): Promise<ContentInfo[]> {
  const urls = extractUrls(text)
  const contentInfoPromises = urls.map(fetchContentInfo)
  return Promise.all(contentInfoPromises)
}

function extractUrls(text: string): URL[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex) || []
  return matches
    .map((url) => {
      try {
        return new URL(url)
      } catch {
        return null
      }
    })
    .filter((url): url is URL => url !== null)
}

async function fetchContentInfo(url: URL): Promise<ContentInfo> {
  try {
    const response = await ky.head(url.toString())
    const contentTypeHeader = response.headers.get('content-type')
    const { type, parameters } = fastContentTypeParse.parse(contentTypeHeader || '')
    return {
      url: url.toString(),
      type,
      parameters,
      isImage: type.startsWith('image'),
    }
  } catch (error) {
    console.error(`Error fetching content info for ${url.toString()}:`, error)
    return {
      url: url.toString(),
      type: 'unknown',
      parameters: {},
      isImage: false,
    }
  }
}

export const analyzeUrlsInText = internalAction({
  args: {
    text: v.string(),
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const results = await analyzeUrls(args.text)
    console.log(results)

    for (const result of results) {
      if (result.isImage) {
        await ctx.runMutation(internal.jobs.createJobM, {
          name: 'files/ingestImageUrl',
          fields: {
            url: result.url,
            messageId: args.messageId,
          },
        })
      }
    }
  },
})
