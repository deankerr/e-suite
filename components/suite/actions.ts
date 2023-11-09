'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'

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
