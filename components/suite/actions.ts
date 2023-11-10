'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { SuiteWorkbench, workbenchSchema } from '@/lib/schemas'
import { fromZodError } from 'zod-validation-error'

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

export async function updateWorkbench(workbench: SuiteWorkbench) {
  const user = await getUserSession()

  const validated = workbenchSchema.safeParse(workbench)

  if (!validated.success) {
    console.error(fromZodError(validated.error))
    throw new Error('Invalid workbench.')
  }

  try {
    await db.updateWorkbench(user.id, validated.data)
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
    } else {
      console.error(err)
    }
  }
}

export async function renameAgent(agentId: string, name: string) {
  console.log('<renameAgent>')
  const user = await getUserSession()

  if (name === '') throw new Error('Name cannot be blank.')

  try {
    return await db.updateUserAgent(user.id, agentId, { name })
  } catch (err) {
    console.error(err)
    throw new Error('An error occurred while renaming agent.')
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
