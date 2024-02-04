import { defineTable } from 'convex/server'
import { v } from 'convex/values'

const agentFields = {
  ownerId: v.id('users'),
  name: v.string(),
}

export const agentsTable = defineTable(agentFields)
