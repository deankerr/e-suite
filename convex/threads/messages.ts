import { v } from 'convex/values'
import { vEnum } from '../util'

export const messageFields = {
  role: vEnum(['system', 'user', 'assistant']),
  name: v.optional(v.string()),
  content: v.string(),
}

export const llmParametersFields = {
  model: v.string(),
  max_tokens: v.optional(v.number()),
  stop: v.optional(v.array(v.string())),
  temperature: v.optional(v.number()),
  top_p: v.optional(v.number()),
  top_k: v.optional(v.number()),
  repetition_penalty: v.optional(v.number()),
}

export const messagesFields = {
  ...messageFields,
  llmParameters: v.optional(v.object(llmParametersFields)),
}
