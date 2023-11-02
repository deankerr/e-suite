import { serverSession } from '@/lib/auth'

export async function GET() {
  const session = await serverSession()

  return Response.json({ name: session?.user?.name ?? 'Not Logged In' })
}
