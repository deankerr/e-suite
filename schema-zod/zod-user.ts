import type {
  getAgentOwnedByUserById as getAgentOwnedByUserByIdDrizzle,
  getAgentsOwnedByUserList,
} from '@/db/user'
import type {
  getAgentOwnedByUserById as getAgentOwnedByUserByIdPrisma,
  getAgentsOwnedByUserList as getAgentsOwnedByUserListPrisma,
} from '@/db/user-prisma'
import z from 'zod'

export type Agent = Awaited<ReturnType<typeof getAgentsOwnedByUserListPrisma>>[number]
export type AgentDetailPrisma = Awaited<ReturnType<typeof getAgentOwnedByUserByIdPrisma>>
export type AgentDetail = Awaited<ReturnType<typeof getAgentOwnedByUserByIdDrizzle>>

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
    engineParameters: schemaAgentParametersRecord,
  })
  .partial()
export type AgentUpdateInputData = z.infer<typeof agentUpdateInputData>
