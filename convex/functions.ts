import { entsTableFactory } from 'convex-ents'
import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomAction, zCustomMutation, zCustomQuery } from 'convex-helpers/server/zod'
import { ConvexError, v } from 'convex/values'

import {
  action as baseAction,
  internalAction as baseInternalAction,
  internalMutation as baseInternalMutation,
  internalQuery as baseInternalQuery,
  mutation as baseMutation,
  query as baseQuery,
} from './_generated/server'
import { getEntDefinitionsWithRules, getViewerIdFromApiKey, getViewerIdFromAuth } from './rules'
import { entDefinitions } from './schema'

import type { MutationCtx as BaseMutationCtx, QueryCtx as BaseQueryCtx } from './_generated/server'

export const authOnlyQuery = zCustomQuery(
  baseQuery,
  customCtx(async (baseCtx) => {
    return await queryCtx(baseCtx)
  }),
)

export const internalQuery = zCustomQuery(
  baseInternalQuery,
  customCtx(async (baseCtx) => {
    return await queryCtx(baseCtx)
  }),
)

export const authOnlyMutation = zCustomMutation(
  baseMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtx(baseCtx)
  }),
)

export const internalMutation = zCustomMutation(
  baseInternalMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtx(baseCtx)
  }),
)

export const action = zCustomAction(baseAction, NoOp)
export const internalAction = zCustomAction(baseInternalAction, NoOp)

async function queryCtx(baseCtx: BaseQueryCtx) {
  const ctx = {
    unsafeDb: baseCtx.db,
    db: undefined as unknown as typeof baseCtx.db,
    skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
  }

  const viewerId = await getViewerIdFromAuth({ ...baseCtx, ...ctx })

  const entDefinitionsWithRules = getEntDefinitionsWithRules({ ...ctx, viewerId } as any)
  const table = entsTableFactory(baseCtx, entDefinitionsWithRules)

  const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
  const viewerX = async () => {
    const ent = await viewer()
    if (ent === null) throw new ConvexError('Expected authenticated viewer')
    return ent
  }

  return { ...ctx, table, viewer, viewerX, viewerId }
}

async function mutationCtx(baseCtx: BaseMutationCtx) {
  const ctx = {
    unsafeDb: baseCtx.db,
    db: undefined as unknown as typeof baseCtx.db,
    skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
  }

  const viewerId = await getViewerIdFromAuth({ ...baseCtx, ...ctx })

  const entDefinitionsWithRules = getEntDefinitionsWithRules({ ...ctx, viewerId } as any)
  const table = entsTableFactory(baseCtx, entDefinitionsWithRules)

  const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
  const viewerX = async () => {
    const ent = await viewer()
    if (ent === null) throw new ConvexError('Expected authenticated viewer')
    return ent
  }

  return { ...ctx, table, viewer, viewerX, viewerId }
}

export const query = zCustomQuery(baseQuery, {
  args: { apiKey: v.optional(v.string()) },
  input: async (baseCtx: BaseQueryCtx, { apiKey }: { apiKey?: string }) => {
    const ctx = {
      unsafeDb: baseCtx.db,
      db: undefined as unknown as typeof baseCtx.db,
      skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
    }

    const viewerId =
      (await getViewerIdFromAuth({ ...baseCtx, ...ctx })) ??
      (await getViewerIdFromApiKey({ ...baseCtx, ...ctx }, apiKey))

    const entDefinitionsWithRules = getEntDefinitionsWithRules({ ...ctx, viewerId } as any)
    const table = entsTableFactory(baseCtx, entDefinitionsWithRules)

    const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
    const viewerX = async () => {
      const ent = await viewer()
      if (ent === null) throw new ConvexError('Expected authenticated viewer')
      return ent
    }

    return { ctx: { ...ctx, table, viewer, viewerX, viewerId }, args: {} }
  },
})

export const mutation = zCustomMutation(baseMutation, {
  args: { apiKey: v.optional(v.string()) },
  input: async (baseCtx, { apiKey }) => {
    const ctx = {
      unsafeDb: baseCtx.db,
      db: undefined as unknown as typeof baseCtx.db,
      skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
    }

    const viewerId =
      (await getViewerIdFromAuth({ ...baseCtx, ...ctx })) ??
      (await getViewerIdFromApiKey({ ...baseCtx, ...ctx }, apiKey))

    const entDefinitionsWithRules = getEntDefinitionsWithRules({ ...ctx, viewerId } as any)
    const table = entsTableFactory(baseCtx, entDefinitionsWithRules)

    const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
    const viewerX = async () => {
      const ent = await viewer()
      if (ent === null) throw new ConvexError('Expected authenticated viewer')
      return ent
    }

    return { ctx: { ...ctx, table, viewer, viewerX, viewerId }, args: {} }
  },
})
