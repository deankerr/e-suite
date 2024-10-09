import { v } from 'convex/values'

import { runFields } from '../../schema'

export const textMessagesReturn = v.object({
  _id: v.id('texts'),
  _creationTime: v.number(),
  title: v.optional(v.string()),
  content: v.string(),
  type: v.string(),
  userId: v.id('users'),
  updatedAt: v.number(),
  runId: v.optional(v.id('runs')),
})

export const runReturnFields = {
  ...runFields,
  _id: v.id('runs'),
  _creationTime: v.number(),
  threadId: v.id('threads'),
  userId: v.id('users'),
}
