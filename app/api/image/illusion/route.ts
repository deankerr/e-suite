import { createProtectedRoute } from '@/lib/protected-route'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// export async function POST(request: NextRequest) {
//   log.info('POST image/illusion')

//   const auth = authenticateGuest(request.headers.get('Authorization'))
//   if (!auth.ok) return auth.response

//   const params = requestSchema.parse(await request.json())
//   log.info(params, 'params')

//   const result = await fal.illusion(params)
//   log.info(result, 'result')

//   return NextResponse.json(result)
// }

export const POST = createProtectedRoute({
  inputSchema: z.any(),
  handler: async () => {
    return Response.json({
      site: process.env.KINDE_SITE_URL,
      out: process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
      in: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
    })
  },
  outputSchema: z.any(),
})

const requestSchema = z.object({
  image_url: z.string().url(),
  prompt: z.string(),
  negative_prompt: z.string().optional(),
})
