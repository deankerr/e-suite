import 'server-only'
import * as schema from '@/drizzle/schema'
import { db } from '@/lib/drizzle'
import { AppError } from '@/lib/error'
import { getRandomAgentAvatar, invariant } from '@/lib/utils'
import {
  Agent,
  CreateAgent,
  createAgentSchema,
  DeleteAgent,
  deleteAgentSchema,
  UpdateAgent,
  updateAgentSchema,
} from '@/schema/dto'
import { and, eq } from 'drizzle-orm'
import { getUserSession } from './auth'
import { agentEntityToDto } from './internal/map'

export async function getUserAgents(): Promise<Agent[]> {
  const user = await getUserSession()
  const agents = await db.query.agents.findMany({
    where: eq(schema.agents.ownerId, user.id),
    with: {
      engine: {
        with: {
          vendor: true,
        },
      },
    },
  })

  return agents.map(agentEntityToDto)
}

export async function getUserAgent(id: string): Promise<Agent> {
  const user = await getUserSession()
  const agent = await db.query.agents.findFirst({
    where: and(eq(schema.agents.ownerId, user.id), eq(schema.agents.id, id)),
    with: {
      engine: {
        with: {
          vendor: true,
        },
      },
    },
  })

  if (!agent) throw new AppError('not_found', 'Agent not found.')
  return agentEntityToDto(agent)
}

//^ returns non DTO
export async function createUserAgent(input: CreateAgent): Promise<string> {
  const user = await getUserSession()
  const values = createAgentSchema.parse(input)

  const engine = await db.query.engines.findFirst()
  invariant(engine, 'Engine not found.')

  const [agent] = await db
    .insert(schema.agents)
    .values({
      ownerId: user.id,
      name: values.name,
      image: getRandomAgentAvatar(),
      engineId: engine.id,
    })
    .returning({ id: schema.agents.id })
  invariant(agent, 'Agent returned from insert is undefined.')

  return agent.id
}

export async function updateUserAgent(input: UpdateAgent): Promise<void> {
  const user = await getUserSession()
  const { id, ...values } = updateAgentSchema.parse(input)

  await db
    .update(schema.agents)
    .set(values)
    .where(and(eq(schema.agents.ownerId, user.id), eq(schema.agents.id, id)))
}

export async function deleteUserAgent(input: DeleteAgent): Promise<void> {
  const user = await getUserSession()
  const { id } = deleteAgentSchema.parse(input)

  await db
    .delete(schema.agents)
    .where(and(eq(schema.agents.ownerId, user.id), eq(schema.agents.id, id)))
}
