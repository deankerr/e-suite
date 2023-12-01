import 'server-only'
import { Agent, agentSchema } from '@/schema/dto'

export function agentEntityToDto(agent: unknown): Agent {
  return agentSchema.parse(agent)
}
