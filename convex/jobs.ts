import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { internalMutation } from './_generated/server'
import { chatProviders } from './constants'
import { chatParametersFields } from './llm/messages'
import { vEnum } from './util'

const jobStatusNames = vEnum([
  'pending',
  'active',
  'complete',
  'error',
  'streaming',
  'cancelled',
  'failed',
])

const jobEventFields = {
  status: jobStatusNames,
  message: v.optional(v.string()),
  data: v.optional(v.any()),
  creationTime: v.number(),
}

const sharedJobsFields = {
  status: jobStatusNames,
  events: v.array(v.object(jobEventFields)),
}

const chatJobFields = {
  resultMessageId: v.id('messages'),
  chatMessageIds: v.array(v.id('messages')),
  chatParameters: v.object(chatParametersFields),
  chatProvider: vEnum(chatProviders),
}

export const jobsTable = defineTable(
  v.union(
    v.object({ type: v.literal('chat'), ...chatJobFields, ...sharedJobsFields }),
    v.object({
      type: v.literal('generation'),
      width: v.number(), // TODO
      height: v.number(),
      n: v.number(),
    }),
  ),
)

export const create = internalMutation({
  args: {
    chat: v.optional(v.object({ ...chatJobFields })),
    generation: v.optional(v.null()),
  },
  handler: async (ctx, { chat, generation }) => {
    if (chat) {
      return await ctx.db.insert('jobs', { ...chat, type: 'chat', status: 'pending', events: [] })
      //TODO trigger workflow
    }

    if (generation) {
      throw new Error('not implemented')
    }
  },
})
