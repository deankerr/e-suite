import 'server-only'
import * as schema from '@/drizzle/schema'
import { db } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'
import { UserSession } from '../auth'

export async function initializeUserData(userSession: UserSession) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userSession.id),
  })

  if (user) return

  await db.insert(schema.users).values({
    id: userSession.id,
    email: userSession.email,
    firstName: userSession.firstName,
    lastName: userSession.lastName,
    image: userSession.image,
  })
}
