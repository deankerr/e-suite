import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomMutation, zCustomQuery } from 'convex-helpers/server/zod'
import { z } from 'zod'
import { Id } from './_generated/dataModel'
import {
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from './_generated/server'
import { assert } from './util'

const userEntity = z.object({
  _id: z.string().transform((v) => v as Id<'users'>),
  _creationTime: z.number(),
  admin: z.boolean(),
  username: z.string(),
  avatar: z.string(),
})

const getLoggedInUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity()
  assert(identity, 'Not logged in')

  const user = await ctx.db
    .query('users')
    .withIndex('token', (q) => q.eq('token', identity.tokenIdentifier))
    .unique()
  assert(user, 'Unregistered identity')
  assert(!user.deleted, 'User is deleted')

  return userEntity.parse(user)
}

export const zInternalQuery = zCustomQuery(internalQuery, NoOp)
export const zInternalMutation = zCustomMutation(internalMutation, NoOp)

export const userQuery = zCustomQuery(
  query,
  customCtx(async (ctx) => {
    const user = await getLoggedInUser(ctx)
    return { user }
  }),
)

export const userInternalQuery = zCustomQuery(
  internalQuery,
  customCtx(async (ctx) => {
    const user = await getLoggedInUser(ctx)
    return { user }
  }),
)

export const userMutation = zCustomMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await getLoggedInUser(ctx)
    return { user }
  }),
)

export const userInternalMutation = zCustomMutation(
  internalMutation,
  customCtx(async (ctx) => {
    const user = await getLoggedInUser(ctx)
    return { user }
  }),
)
