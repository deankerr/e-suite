import { v } from 'convex/values'
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

export const jobEventFields = {
  status: jobStatusNames,
  message: v.optional(v.string()),
  data: v.optional(v.any()),
}

export const jobTypes = vEnum(['llm', 'throw'])

export const jobRefs = v.union(v.id('messages'), v.id('generations'))

export const jobFields = {
  type: jobTypes,
  ref: jobRefs,
  status: jobStatusNames,
  events: v.array(v.object({ ...jobEventFields, creationTime: v.number() })),
}
