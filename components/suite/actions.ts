'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import {
  SuiteAgentUpdateMergeObject,
  suiteAgentUpdateMergeSchema,
  suiteInferenceParametersSchema,
  SuiteInferenceParametersSchema,
  SuiteWorkbenchUpdateMergeObject,
  suiteWorkbenchUpdateMergeSchema,
} from '@/lib/schemas'
import { fromZodError } from 'zod-validation-error'

// TODO integrate with db -> actions can only ever modify current session user
// TODO standard ownership of functionality implementation (db or actions)

async function getUserSession() {
  const session = await auth()
  if (!session) throw new Error('You are not logged in.')
  return session.user
}

export async function getSuiteUser() {
  console.log('action getSuite')
  const user = await getUserSession()

  try {
    const suite = await db.getSuiteUser(user.id)
    return suite
  } catch (err) {
    console.error(err)
    throw new Error('Failed to get current user')
  }
}

export async function updateWorkbench(workbench: SuiteWorkbenchUpdateMergeObject) {
  const user = await getUserSession()

  const validated = suiteWorkbenchUpdateMergeSchema.safeParse(workbench)

  if (!validated.success) {
    console.error(fromZodError(validated.error))
    throw new Error('Invalid workbench.')
  }

  try {
    await db.updateWorkbench(user.id, validated.data)
  } catch (err) {
    console.error(err)
    throw new Error('Failed to update workbench.')
  }
}

export async function updateSuiteUserAgent(agentId: string, merge: SuiteAgentUpdateMergeObject) {
  const user = await getUserSession()

  const parsedMerge = suiteAgentUpdateMergeSchema.safeParse(merge)
  if (!parsedMerge.success) {
    console.error(fromZodError(parsedMerge.error))
    throw new Error('Invalid Agent update.')
  }

  const suiteUser = await db.getSuiteUser(user.id)
  const agent = suiteUser.agents.find((agent) => agent.id === agentId)
  if (!agent) throw new Error('Invalid Agent id.')

  try {
    await db.updateUserAgent(user.id, agent.id, parsedMerge.data)
  } catch (err) {
    console.error(err)
    throw new Error('Failed to update Agent.')
  }
}

export async function updateAgentInferenceParameters(
  agentId: string,
  merge: SuiteInferenceParametersSchema,
) {
  const user = await getUserSession()

  const parsedMerge = suiteInferenceParametersSchema.safeParse(merge)
  if (!parsedMerge.success) {
    console.error(fromZodError(parsedMerge.error))
    throw new Error('Invalid Agent Inference Parameter update.')
  }
  console.log('merge', parsedMerge.data)
  let agent
  try {
    agent = await db.getSuiteUserAgent(user.id, agentId)
  } catch (err) {
    console.error(err)
    throw new Error('Invalid Agent.')
  }

  const parsedCurrent = suiteInferenceParametersSchema.safeParse(agent.parameters)
  const current = parsedCurrent.success ? parsedCurrent.data : {}

  console.log('current', current)

  const merged = {
    ...current,
    ...parsedMerge.data,
  }

  console.log('merged', merged)

  try {
    await db.updateUserAgent(user.id, agentId, { parameters: merged })
  } catch (err) {
    console.error(err)
    throw new Error('Failed to update Agent parameters.')
  }
}

export async function getEngines() {
  await getUserSession()

  try {
    return await db.getEngines()
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
    } else {
      console.error(err)
    }
    throw new Error('An error occured while fetching engines.')
  }
}
