import * as schema from '@/drizzle/schema'
import { inferenceParametersRecordSchema } from '@/schema/dto'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'

type AgentSelect = typeof schema.agents.$inferSelect
type EngineSelect = typeof schema.engines.$inferSelect
type VendorSelect = typeof schema.vendors.$inferSelect

export type AgentEntity = AgentSelect & { engine: EngineSelect & { vendor: VendorSelect } }

export const insertUserSchema = createInsertSchema(schema.users)
export type InsertUserValues = z.infer<typeof insertUserSchema>

// TODO - move to DTO, needless duplication
export const insertAgentSchema = z.object({
  name: z
    .string()
    .transform((n) => n.trim())
    .refine((n) => n.length > 0)
    .transform((n) => (n.length > 32 ? n.slice(0, 32) : n)),
})
export type InsertAgentValues = z.infer<typeof insertAgentSchema>

export const updateAgentSchema = z
  .object({
    name: z
      .string()
      .transform((n) => n.trim())
      .refine((n) => n.length > 0)
      .transform((n) => (n.length > 32 ? n.slice(0, 32) : n)),
    engineId: z.string().min(1),
    engineParameters: inferenceParametersRecordSchema,
  })
  .partial()
  .merge(z.object({ id: z.string() }))
export type UpdateAgentValues = z.infer<typeof updateAgentSchema>
