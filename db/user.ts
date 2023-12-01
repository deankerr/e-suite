import 'server-only'
import * as schema from '@/drizzle/schema'
import { db } from '@/lib/drizzle'
import { getSession, Session } from '@/lib/server'
import { getRandomAgentAvatar } from '@/lib/utils'
import { AgentUpdateInputData, schemaAgentParametersRecord } from '@/schema-zod/zod-user'
import { createId } from '@paralleldrive/cuid2'
import { and, eq } from 'drizzle-orm'

export async function initializeUserSession() {
  const session = await getSession()
  if (!session) return null

  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.id, session.id),
    with: {
      agents: {
        with: {
          engine: {
            with: {
              vendor: true,
            },
          },
        },
      },
    },
  })

  const user = existingUser ?? (await createSessionUser(session))

  return {
    user: session,
    agents: user.agents,
  }
}

async function getExistingUser(session: Session) {
  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.id, session.id),
    with: {
      agents: {
        with: {
          engine: {
            with: {
              vendor: true,
            },
          },
        },
      },
    },
  })

  return existingUser
}

async function createSessionUser(session: Session) {
  const { role, ...newUser } = session
  const user = await db.insert(schema.users).values(newUser).returning().all()
  console.log('new user', user)
  return { ...user, agents: [] }
}

function validateAgentParameters(parameters: unknown) {
  const parsed = schemaAgentParametersRecord.safeParse(parameters)
  if (parsed.success) {
    return parsed.data
  }

  return {}
}

export async function getAgentOwnedByUserById({ ownerId, id }: { ownerId: string; id: string }) {
  const agent = await db.query.agents.findFirst({
    where: and(eq(schema.agents.ownerId, ownerId), eq(schema.agents.id, id)),
    with: {
      engine: {
        with: {
          vendor: true,
        },
      },
    },
  })

  if (!agent) throw new Error('no agent handle me')

  const parsed = { ...agent, engineParameters: validateAgentParameters(agent.engineParameters) }
  return parsed
}

export async function getAgentsOwnedByUserList({ ownerId }: { ownerId: string }) {
  return await db.query.agents.findMany({
    where: eq(schema.agents.ownerId, ownerId),
  })
}

export async function updateAgentOwnedByUser({
  ownerId,
  id,
  data,
}: {
  ownerId: string
  id: string
  data: AgentUpdateInputData
}) {
  const { engineId, ...inputData } = data

  if (engineId) {
    await db
      .update(schema.agents)
      .set({
        ...inputData,
        engineId: data.engineId,
      })
      .where(and(eq(schema.agents.ownerId, ownerId), eq(schema.agents.id, id)))
      .run()
  } else {
    await db
      .update(schema.agents)
      .set(inputData)
      .where(and(eq(schema.agents.ownerId, ownerId), eq(schema.agents.id, id)))
      .run()
  }
}

export async function createAgentOwnedByUser({ ownerId, name }: { ownerId: string; name: string }) {
  const engine = await db.query.engines.findFirst()
  if (!engine) throw new Error('no engine handle me')

  const agent = await db
    .insert(schema.agents)
    .values({
      id: createId(), //? use default function
      ownerId,
      name,
      image: getRandomAgentAvatar(),
      engineId: engine.id,
      engineParameters: JSON.stringify({}),
    })
    .returning({ id: schema.agents.id })

  return agent[0]?.id!
}

export async function deleteAgentOwnedByUser({ ownerId, id }: { ownerId: string; id: string }) {
  await db
    .delete(schema.agents)
    .where(and(eq(schema.agents.ownerId, ownerId), eq(schema.agents.id, id)))
    .run()
}
