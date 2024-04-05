/**
 * This file defines a `runAction` helper function that can be used to retry a
 * Convex action until it succeeds. An action should only be retried if it is
 * safe to do so, i.e., if it's idempotent or doesn't have any unsafe side effects.
 */

import { makeFunctionReference } from 'convex/server'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalMutation } from '../_generated/server'

import type { MutationCtx } from '../types'

const DEFAULT_WAIT_BACKOFF = 10
const DEFAULT_RETRY_BACKOFF = 10
const DEFAULT_BASE = 2
const DEFAULT_MAX_FAILURES = 16

/**
 * Run and retry action until it succeeds or fails too many times.
 *
 * @param action - Name of the action to run, e.g., `usercode:maybeAction`.
 * @param actionArgs - Arguments to pass to the action, e.g., `{"failureRate": 0.75}`.
 * @param [waitBackoff=DEFAULT_WAIT_BACKOFF (10)] - Initial delay before checking action status, in milliseconds.
 * @param [retryBackoff=DEFAULT_RETRY_BACKOFF (10)] - Initial delay before retrying, in milliseconds.
 * @param [base=DEFAULT_BASE (2)] - Base of the exponential backoff.
 * @param [maxFailures=DEFAULT_MAX_FAILURES (16)] - The maximum number of times to retry the action.
 */

export const runAction = async (
  ctx: MutationCtx,
  {
    action,
    actionArgs,
    waitBackoff = DEFAULT_WAIT_BACKOFF,
    retryBackoff = DEFAULT_RETRY_BACKOFF,
    base = DEFAULT_BASE,
    maxFailures = DEFAULT_MAX_FAILURES,
  }: {
    action: string
    actionArgs: any
    waitBackoff?: number
    retryBackoff?: number
    base?: number
    maxFailures?: number
  },
) => {
  const jobId = await ctx.scheduler.runAfter(0, makeFunctionReference<'action'>(action), actionArgs)
  await ctx.scheduler.runAfter(0, internal.lib.retrier.retry, {
    job: jobId,
    action,
    actionArgs,
    waitBackoff,
    retryBackoff,
    base,
    maxFailures,
  })
  return jobId
}

export const retry = internalMutation({
  args: {
    job: v.id('_scheduled_functions'),
    action: v.string(),
    actionArgs: v.any(),
    waitBackoff: v.number(),
    retryBackoff: v.number(),
    base: v.number(),
    maxFailures: v.number(),
  },
  handler: async (ctx, args) => {
    const { job } = args
    const status = await ctx.db.system.get(job)
    if (!status) {
      throw new Error(`Job ${job} not found`)
    }

    switch (status.state.kind) {
      case 'pending':
      case 'inProgress':
        console.debug(`Job ${job} not yet complete, checking again in ${args.waitBackoff} ms.`)
        await ctx.scheduler.runAfter(args.waitBackoff, internal.lib.retrier.retry, {
          ...args,
          waitBackoff: args.waitBackoff * args.base,
        })
        break

      case 'failed':
        if (args.maxFailures <= 0) {
          console.error(`Job ${job} failed too many times, not retrying.`)
          break
        }
        console.warn(`Job ${job} failed, retrying in ${args.retryBackoff} ms.`)
        const newJob = await ctx.scheduler.runAfter(
          args.retryBackoff,
          makeFunctionReference<'action'>(args.action),
          args.actionArgs,
        )
        await ctx.scheduler.runAfter(args.retryBackoff, internal.lib.retrier.retry, {
          ...args,
          job: newJob,
          retryBackoff: args.retryBackoff * args.base,
          maxFailures: args.maxFailures - 1,
        })
        break

      case 'success':
        console.debug(`Job ${job} succeeded.`)
        break
      case 'canceled':
        console.log(`Job ${job} was canceled. Not retrying.`)
        break
    }
  },
})
