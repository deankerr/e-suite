'use server'

import { getEngineById, getEnginesList } from '@/api/data'
import {
  getAgentOwnedByUserById,
  getAgentsOwnedByUserList,
  updateAgentOwnedByUser,
} from '@/api/user'
import { actionValidator } from '@/lib/action'
import { agentUpdateInputData } from '@/schema/user'
import z from 'zod'

//* Agents
export const getAllAgents = actionValidator(
  z.void(),
  async ({ user }) => await getAgentsOwnedByUserList({ ownerId: user.id }),
)

export const getAgent = actionValidator(
  z.object({ id: z.string() }),
  async ({ user, data }) => await getAgentOwnedByUserById({ ownerId: user.id, id: data.id }),
)

export const updateAgent = actionValidator(
  z.object({ id: z.string(), data: agentUpdateInputData }),
  async ({ user, data }) =>
    await updateAgentOwnedByUser({ ownerId: user.id, id: data.id, data: data.data }),
)

//* Engines
export const getAllEngines = actionValidator(z.void(), async () => await getEnginesList())

export const getEngine = actionValidator(
  z.object({ id: z.string() }),
  async ({ data }) => await getEngineById({ id: data.id }),
)
