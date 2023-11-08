'use server'

import { db } from '@/lib/db'

export async function getUser(userId: string) {
  const user = await db.getUser(userId)
  return user
}
