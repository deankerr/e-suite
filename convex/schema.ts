import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { v } from 'convex/values'

export const usersFields = {
  tokenIdentifier: v.string(),
  name: v.string(),
  imageUrl: v.string(),
  role: v.union(v.literal('user'), v.literal('admin')),
}
const users = defineEnt(usersFields).deletion('soft').index('tokenIdentifier', ['tokenIdentifier'])

const schema = defineEntSchema(
  {
    users,
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
