import { Agent, agentSchema } from '@/schema/dto'
import { AgentEntity } from './schema'

export function agentEntityToDto(agent: AgentEntity): Agent {
  return agentSchema.parse(agent)
}
