'use server'

import { action } from '@/lib/action'
import z from 'zod'

//* Agents
export const getAllAgents = action({
  input: z.void(),
  user: async ({ userDao }) => await userDao.agents.getAll(),
})

// export const getAllAgents = actionValidator(z.void(), async ({ user }) =>
//   (await createUserDao()).agents.getAll(),
// )

export const getAgent = action({
  input: z.object({ id: z.string() }),
  user: async ({ userDao, input }) => await userDao.agents.get({ id: input.id }),
})

// export const getAgent = actionValidator(
//   z.object({ id: z.string() }),
//   async ({ user, data }) => await dataUserAgent.getUserAgent(data.id),
// )

export const updateAgent = action({
  input: z.record(z.unknown()),
  user: async ({ userDao, input }) => await userDao.agents.update({ values: input }),
})

// export const updateAgent = actionValidator(
//   updateAgentSchema,
//   async ({ user, data }) => await dataUserAgent.updateUserAgent(data),
// )

export const createAgent = action({
  input: z.record(z.unknown()),
  user: async ({ userDao, input }) => await userDao.agents.create({ values: input }),
})

// export const createAgent = actionValidator(
//   z.object({ name: z.string().min(1) }),
//   async ({ user, data }) => await dataUserAgent.createUserAgent({ name: data.name }),
// )

export const deleteAgent = action({
  input: z.object({ id: z.string() }),
  user: async ({ userDao, input }) => await userDao.agents.delete({ id: input.id }),
})

// export const deleteAgent = actionValidator(
//   z.object({ id: z.string() }),
//   async ({ user, data }) => await dataUserAgent.deleteUserAgent({ id: data.id }),
// )

//* Engines
export const getAllResources = action({
  input: z.void(),
  user: async ({ userDao }) => await userDao.resources.getAll(),
})
// export const getAllEngines = actionValidator(z.void(), async () => await dataEngines.getEngines())

export const getResource = action({
  input: z.object({ id: z.string() }),
  user: async ({ userDao, input }) => await userDao.resources.get(input.id),
})
// export const getEngine = actionValidator(
//   z.object({ id: z.string() }),
//   async ({ data }) => await dataEngines.getEngine(data.id),
// )
