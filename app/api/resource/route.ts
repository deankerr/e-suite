import { createProtectedRoute } from '@/lib/protected-route'
import z from 'zod'

export const GET = createProtectedRoute({
  inputSchema: z.void(),
  handler: async () => Response.json({ resource: 1 }),
  outputSchema: z.record(z.any()),
})
