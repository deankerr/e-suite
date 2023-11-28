'use server'

import { getEngineById, getEnginesList } from '@/api/data'
import {
  createAgentOwnedByUser,
  deleteAgentOwnedByUser,
  getAgentOwnedByUserById,
  getAgentsOwnedByUserList,
  updateAgentOwnedByUser,
} from '@/api/user'
import { actionValidator } from '@/lib/action-validator'
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

export const createAgent = actionValidator(
  z.object({ name: z.string().min(1) }),
  async ({ user, data }) => await createAgentOwnedByUser({ ownerId: user.id, name: data.name }),
)

export const deleteAgent = actionValidator(
  z.object({ id: z.string() }),
  async ({ user, data }) => await deleteAgentOwnedByUser({ ownerId: user.id, id: data.id }),
)

//* Engines
export const getAllEngines = actionValidator(z.void(), async () => await getEnginesList())

export const getEngine = actionValidator(
  z.object({ id: z.string() }),
  async ({ data }) => await getEngineById({ id: data.id }),
)
