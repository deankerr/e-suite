import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zodToConvexFields } from 'convex-helpers/server/zod'
import z from 'zod'

export const usersFields = {
  tokenIdentifier: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
}
const users = defineEnt(zodToConvexFields(usersFields))
  .deletion('soft')
  .index('tokenIdentifier', ['tokenIdentifier'])

const schema = defineEntSchema(
  {
    users,
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
