import { entsTableFactory } from 'convex-ents'
import { customCtx, customMutation, customQuery } from 'convex-helpers/server/customFunctions'
import {
  internalMutation as baseInternalMutation,
  internalQuery as baseInternalQuery,
  mutation as baseMutation,
  MutationCtx as BaseMutationCtx,
  query as baseQuery,
  QueryCtx as BaseQueryCtx,
} from './_generated/server'
import { getEntDefinitionsWithRules, getViewerId } from './rules'
import { entDefinitions } from './schema'
import { error } from './util'

export const query = customQuery(
  baseQuery,
  customCtx(async (baseCtx) => {
    return await queryCtx(baseCtx)
  }),
)

export const internalQuery = customQuery(
  baseInternalQuery,
  customCtx(async (baseCtx) => {
    return await queryCtx(baseCtx)
  }),
)

export const mutation = customMutation(
  baseMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtx(baseCtx)
  }),
)

export const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtx(baseCtx)
  }),
)

async function queryCtx(baseCtx: BaseQueryCtx) {
  const ctx = {
    unsafeDb: baseCtx.db,
    db: undefined,
    skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
  }

  const viewerId = await getViewerId({ ...baseCtx, ...ctx })
  const viewerIdX = () => {
    if (viewerId === null) throw error('Expected authenticated viewer')
    return viewerId
  }

  const entDefinitionsWithRules = getEntDefinitionsWithRules({ ...ctx, viewerId } as any)
  const table = entsTableFactory(baseCtx, entDefinitionsWithRules)

  const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
  const viewerX = async () => {
    const ent = await viewer()
    if (ent === null) throw error('Expected authenticated viewer')
    return ent
  }

  return { ...ctx, table, viewer, viewerX, viewerId, viewerIdX }
}

async function mutationCtx(baseCtx: BaseMutationCtx) {
  const ctx = {
    unsafeDb: baseCtx.db,
    db: undefined,
    skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
  }

  const viewerId = await getViewerId({ ...baseCtx, ...ctx })
  const viewerIdX = () => {
    if (viewerId === null) throw error('Expected authenticated viewer')
    return viewerId
  }

  const entDefinitionsWithRules = getEntDefinitionsWithRules({ ...ctx, viewerId } as any)
  const table = entsTableFactory(baseCtx, entDefinitionsWithRules)

  const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
  const viewerX = async () => {
    const ent = await viewer()
    if (ent === null) throw error('Expected authenticated viewer')
    return ent
  }

  return { ...ctx, table, viewer, viewerX, viewerId, viewerIdX }
}
