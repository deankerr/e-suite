'use server'

import * as dataEngines from '@/data/engines'
import * as dataUserAgent from '@/data/user-agents'
import { actionValidator } from '@/lib/action-validator'
import { updateAgentSchema } from '@/schema/dto'
import z from 'zod'

//* Agents
export const getAllAgents = actionValidator(
  z.void(),
  async ({ user }) => await dataUserAgent.getUserAgents(),
)

export const getAgent = actionValidator(
  z.object({ id: z.string() }),
  async ({ user, data }) => await dataUserAgent.getUserAgent(data.id),
)

export const updateAgent = actionValidator(
  updateAgentSchema,
  async ({ user, data }) => await dataUserAgent.updateUserAgent(data),
)

export const createAgent = actionValidator(
  z.object({ name: z.string().min(1) }),
  async ({ user, data }) => await dataUserAgent.createUserAgent({ name: data.name }),
)

export const deleteAgent = actionValidator(
  z.object({ id: z.string() }),
  async ({ user, data }) => await dataUserAgent.deleteUserAgent({ id: data.id }),
)

//* Engines
export const getAllEngines = actionValidator(z.void(), async () => await dataEngines.getEngines())

export const getEngine = actionValidator(
  z.object({ id: z.string() }),
  async ({ data }) => await dataEngines.getEngine(data.id),
)
