import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import z from 'zod'

export const usersFields = {
  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
}
const users = defineEnt(zodToConvexFields(usersFields))
  .deletion('soft')
  .field('tokenIdentifier', zodToConvex(z.string()), { unique: true })

const schema = defineEntSchema(
  {
    users,
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
