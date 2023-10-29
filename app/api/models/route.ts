import { authenticateGuest } from '@/lib/api/api'
import { NextResponse } from 'next/server'

const testData = [
  { id: 'test1', content: 'return available models here' },
  { id: 'test2', content: 'i love you' },
]

export async function GET(request: Request) {
  const auth = authenticateGuest(request.headers.get('Authorization'))
  if (!auth.ok) return auth.response

  return NextResponse.json(testData)
}
