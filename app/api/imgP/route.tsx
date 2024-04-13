// nextjs app router router
import { cookies, headers } from 'next/headers'
import { NextRequest, userAgent } from 'next/server'
import { z } from 'zod'

import { ImgPObject } from '@/convex/schema'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const headersList = headers()
  const cookiesStore = cookies()

  const ck = cookiesStore.get('esuite-imgp')
  const ckv = parseInt(ck?.value ?? '')
  const imgP = Number.isNaN(ckv) ? Math.floor(Math.random() * 2 ** 50) : ckv

  cookiesStore.set('esuite-imgp', imgP.toString(), {
    expires: new Date('2025-11-11'),
    sameSite: 'strict',
    secure: true,
  })

  const hl = [...headersList.entries()].filter(
    ([k]) => !['x-clerk-auth-token', 'cookie'].includes(k),
  )

  let width = -1
  let height = -1

  try {
    const { w, h } = schema.parse(await request.json())
    width = w
    height = h
  } catch (err) {
    console.error(err)
  }

  const body: ImgPObject = {
    ag: userAgent(request),
    hl,
    geo: request.geo,
    ip: request.ip,
    width,
    height,
    imgP: imgP.toString(),
  }

  const apiUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL
  if (apiUrl) {
    const url = new URL('/imgp', apiUrl)
    await fetch(url, { method: 'POST', body: JSON.stringify(body) })
  }

  return new Response()
}

const schema = z.object({ w: z.number(), h: z.number() })
