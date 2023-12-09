import { t } from '@/lib/drizzle'

export type InsertResources = typeof t.resources.$inferInsert
export type SelectResources = typeof t.resources.$inferSelect

export type InsertModels = typeof t.models.$inferInsert
