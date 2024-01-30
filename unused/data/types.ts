import { t } from '@/lib/drizzle'
import z from 'zod'
import type { createAdminDao } from './admin'
import type { updateAgent } from './internal/agents.entity'
import type { createUserDao } from './user'

export type InsertResources = typeof t.resources.$inferInsert
export type SelectResources = typeof t.resources.$inferSelect

export type InsertModels = typeof t.models.$inferInsert

export type CreateAgent = { name: string }

export type AdminDao = Awaited<ReturnType<typeof createAdminDao>>
export type UserDao = Awaited<ReturnType<typeof createUserDao>>

export type DaoLevel = {
  admin: AdminDao
  user: UserDao
}

export type Agent = typeof t.agents.$inferSelect & { resource: Resource }
export type AgentUpdate = z.infer<typeof updateAgent>

export type Model = typeof t.models.$inferSelect
export type Resource = typeof t.resources.$inferSelect & { vendor: Vendor }
export type Vendor = typeof t.vendors.$inferSelect
