import { zid } from 'convex-helpers/server/zod'
import { ConvexHttpClient } from 'convex/browser'
import { datePlus } from 'itty-time'
import { nanoid } from 'nanoid/non-secure'
import { cookies } from 'next/headers'
import { NextRequest, userAgent } from 'next/server'
import { z } from 'zod'

import { api } from '@/convex/_generated/api'
import { generationVoteFields } from '@/convex/schema'

export const runtime = 'edge'

const voteSchema = z.object({ vote: generationVoteFields.vote, generationId: zid('generations') })

export async function POST(request: NextRequest) {
  try {
    const vote = voteSchema.parse(await request.json())

    const cookiesStore = cookies()
    const cookie = cookiesStore.get('constituent')
    const constituent = cookie?.value.length === 21 ? cookie.value : nanoid()
    cookiesStore.set('constituent', constituent, {
      expires: datePlus('1 year'),
      sameSite: 'strict',
      secure: true,
    })

    const body = {
      ...vote,
      ip: request.ip ?? '(missing)',
      constituent,
      metadata: {
        geo: request.geo,
        ua: userAgent(request),
        ck: constituent,
      },
    }

    const address = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!address) throw new Error('NEXT_PUBLIC_CONVEX_URL is not set')

    const client = new ConvexHttpClient(address)
    await client.mutation(api.generation.register, body)

    return Response.json({ constituent })
  } catch (err) {
    console.error(err)
    return new Response(null, { status: 500 })
  }
}
