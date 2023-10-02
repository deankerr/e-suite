import { openai } from '@/lib/provider/openai'
import { replicate } from '@/lib/provider/replicate'
import { togetherai } from '@/lib/provider/togetherai'
import { logger } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

const log = logger.child({}, { msgPrefix: '[api/image] ' })

export async function POST(request: NextRequest) {
  log.info('POST', request.url)

  const { provider, ...params } = requestSchema.parse(await request.json())
  log.info(params, 'parameters')

  let result: { url?: string; base64?: string }
  if (provider === 'openai') {
    try {
      const { prompt } = params
      const { item } = await openai.image({ prompt })
      result = item
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        const { status, message } = error
        return sendErrorResponse({ status, message })
      } else {
        throw error
      }
    }
  } else if (provider === 'togetherai') {
    const { item } = await togetherai.image(params)
    result = item
  } else if (provider === 'replicate') {
    try {
      const { item } = await replicate.image(params)
      result = item
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error
        return sendErrorResponse({ message })
      } else {
        throw error
      }
    }
  } else {
    throw new Error('unsupported provider')
  }

  log.info(result, 'result')
  return NextResponse.json(result)
}

// async function openai(params: ImageParams) {
//   try {
//     console.log('openai', params)
//     const { prompt } = params
//     const api = new OpenAI()
//     const response = await api.images.generate({
//       prompt,
//     })
//     const url = response.data[0]?.url ?? raise('response missing expected url')
//     return NextResponse.json({ url })
//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//       const { status, message } = error
//       return sendErrorResponse({ status, message })
//     } else {
//       throw error
//     }
//   }
// }

// async function togetherai(params: ImageParams) {
//   console.log('togetherai', params)
//   const apiKey = env('TOGETHERAI_API_KEY')

//   const response = await fetch('https://api.together.xyz/inference', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify(params),
//   })
//   if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)

//   const result = responseSchema.togetherai.parse(await response.json())
//   const base64 = result.output.choices[0]?.image_base64 ?? raise('response missing expected data')
//   return NextResponse.json({ base64 })
// }

// async function replicate(params: ImageParams) {
//   try {
//     console.log('replicate')
//     const { prompt, model } = params
//     const api = new Replicate({ auth: env('REPLICATE_API_KEY') })
//     const input = { prompt }
//     const response = await api.run(model as `${string}/${string}:${string}`, { input })

//     const result = z.string().url().array().parse(response)
//     const url = result[0] ?? raise('replicate response missing data')
//     return NextResponse.json({ url })
//   } catch (error) {
//     if (error instanceof Error) {
//       const { message } = error
//       return sendErrorResponse({ message })
//     } else {
//       throw error
//     }
//   }
// }

function sendErrorResponse({ status, message }: { status?: number; message?: string }) {
  const error = {
    status: status ?? 400,
    message: message ?? 'An unknown error occurred.',
  }
  return NextResponse.json({ error })
}

const requestSchema = z.object({
  prompt: z.string(),
  negative_prompt: z.string().optional(),
  model: z.string().optional(),
  provider: z.string(),
})
