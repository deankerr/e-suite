import type { getAgentOwnedByUserById, getAgentsOwnedByUserList } from '@/api/user'
import type { Agent as PrismaAgent } from '@prisma/client'
import z from 'zod'

export type Agent = Awaited<ReturnType<typeof getAgentsOwnedByUserList>>[number]
export type AgentDetail = Awaited<ReturnType<typeof getAgentOwnedByUserById>>

export const schemaAgentParameters = z
  .object({
    temperature: z.number(),
    max_tokens: z.number(),
    frequency_penalty: z.number(),
    presence_penalty: z.number(),
    repetition_penalty: z.number(),
    top_p: z.number(),
    top_k: z.number(),
    stop: z.string().array(),
    stop_token: z.string(),
  })
  .partial()

export const schemaAgentParametersRecord = z.record(schemaAgentParameters)
export type AgentParametersRecord = z.infer<typeof schemaAgentParametersRecord>

export const agentUpdateInputData = z
  .object({
    name: z.string(),
    image: z.string(),
    engineId: z.string(),
    parameters: schemaAgentParametersRecord,
  })
  .partial()
export type AgentUpdateInputData = z.infer<typeof agentUpdateInputData>
