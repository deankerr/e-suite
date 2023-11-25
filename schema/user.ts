import type { Prisma, Agent as PrismaAgent } from '@prisma/client'
import z from 'zod'

export type Agent = PrismaAgent

export const agentUpdateInputData = z
  .object({
    name: z.string(),
    image: z.string(),
    engineId: z.string(),
    parameters: z.record(z.any()),
  })
  .partial()
export type AgentUpdateInputData = z.infer<typeof agentUpdateInputData>
