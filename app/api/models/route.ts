import { authenticateGuest } from '@/lib/api/api'

export async function GET(request: Request) {
  const auth = authenticateGuest(request.headers.get('Authorization'))
  if (!auth.ok) return auth.response

  return new Response('hello')
}
