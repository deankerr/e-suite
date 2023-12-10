'use server'

import { action } from '@/lib/action'
import z from 'zod'

//* Agents
export const getAllAgents = action({
  input: z.void(),
  user: async ({ userDao }) => await userDao.agents.getAll(),
})

export const getAgent = action({
  input: z.object({ id: z.string() }),
  user: async ({ userDao, input }) => await userDao.agents.get({ id: input.id }),
})

export const updateAgent = action({
  input: z.record(z.unknown()),
  user: async ({ userDao, input }) => await userDao.agents.update({ values: input }),
})

export const createAgent = action({
  input: z.record(z.unknown()),
  user: async ({ userDao, input }) => await userDao.agents.create({ values: input }),
})

export const deleteAgent = action({
  input: z.object({ id: z.string() }),
  user: async ({ userDao, input }) => await userDao.agents.delete({ id: input.id }),
})

//* Engines
export const getAllResources = action({
  input: z.void(),
  user: async ({ userDao }) => await userDao.resources.getAll(),
})

export const getResource = action({
  input: z.object({ id: z.string() }),
  user: async ({ userDao, input }) => await userDao.resources.get(input.id),
})
