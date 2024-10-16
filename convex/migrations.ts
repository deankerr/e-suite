import { makeMigration } from 'convex-helpers/server/migrations'
import { literals } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { internalMutation } from './_generated/server'
import { modelParametersFields } from './schema'

import type { Id } from './_generated/dataModel'
import type { Infer } from 'convex/values'

const runFieldsV0 = {
  status: literals('queued', 'active', 'done', 'failed'),
  updatedAt: v.number(),
  startedAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),

  model: v.object({
    id: v.string(),
    provider: v.string(),
  }),
  modelParameters: v.optional(v.object(modelParametersFields)),
  instructions: v.optional(v.string()),

  stream: v.boolean(),
  firstTokenAt: v.optional(v.number()),

  maxMessages: v.optional(v.number()),
  prependNamesToMessageContent: v.optional(v.boolean()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  usage: v.optional(
    v.object({
      promptTokens: v.number(),
      completionTokens: v.number(),
      totalTokens: v.number(),
    }),
  ),
  finishReason: v.optional(v.string()),
  cost: v.optional(v.number()),
  providerMetadata: v.optional(v.any()),
  errors: v.optional(v.array(v.any())),

  messageId: v.optional(v.id('messages')),
}
const runV0 = v.object(runFieldsV0)
type RunFieldsV0 = Infer<typeof runV0>

const migration = makeMigration(internalMutation, {
  migrationTable: 'migrations',
})

// * same: status, stream, instructions, kvMetadata,

export const runsV0ToV2_3 = migration({
  table: 'runs',
  migrateOne: async (ctx, doc) => {
    const runV0 = doc as unknown as RunFieldsV0
    const { status, stream, instructions } = runV0
    const { maxTokens, ...parameters } = runV0.modelParameters ?? {}

    const options = {
      maxMessages: runV0.maxMessages,
      maxCompletionTokens: maxTokens,
    }

    const usage = runV0.usage
      ? {
          cost: runV0.cost,
          finishReason: runV0.finishReason ?? 'unknown',
          promptTokens: runV0.usage?.promptTokens ?? 0,
          completionTokens: runV0.usage?.completionTokens ?? 0,
          modelId: runV0.model.id,
          requestId: '',
        }
      : undefined

    const results = runV0.messageId
      ? [
          {
            type: 'message' as const,
            id: runV0.messageId as Id<'messages'>,
          },
        ]
      : undefined

    const errors = runV0.errors
      ? runV0.errors.map((error) =>
          typeof error === 'string'
            ? {
                code: 'unknown',
                message: error,
              }
            : error,
        )
      : undefined

    return {
      status,
      stream,
      model: {
        ...runV0.model,
        ...parameters,
      },

      options,

      instructions,

      timings: {
        queuedAt: doc._creationTime,
        startedAt: runV0.startedAt,
        endedAt: runV0.endedAt,
        firstTokenAt: runV0.firstTokenAt,
      },

      usage,
      results,

      errors,

      providerMetadata: runV0.providerMetadata,

      kvMetadata: runV0.kvMetadata ?? {},
      updatedAt: runV0.updatedAt,

      // delete v0 fields
      modelParameters: undefined,
      startedAt: undefined,
      endedAt: undefined,
      firstTokenAt: undefined,
      maxMessages: undefined,
      prependNamesToMessageContent: undefined,
      finishReason: undefined,
      cost: undefined,
      messageId: undefined,
    }
  },
  batchSize: 500,
})

// export const threadsDepFields2 = migration({
//   table: 'threads',
//   migrateOne: async (ctx, doc) => {
//     if (doc.favorite !== undefined) {
//       return {
//         ...doc,
//         favorite: undefined,
//       }
//     }
//     return doc
//   },
//   batchSize: 500,
// })

// export const messagesDepFields = migration({
//   table: 'messages',
//   migrateOne: async (ctx, doc) => {
//     if (doc.contentType || doc.inference) {
//       return {
//         ...doc,
//         contentType: undefined,
//         inference: undefined,
//       }
//     }
//     return doc
//   },
//   batchSize: 500,
// })
