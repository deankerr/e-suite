import { z } from 'zod'

import { createJob } from '../jobs/interface'
import { generateRid, insist } from '../utils'

import type { InferenceSchema, messageFieldsObject } from '../schema'
import type { MutationCtx } from '../types'

export const createThread = async (ctx: MutationCtx) => {
  const user = await ctx.viewerX()
  const rid = await generateRid(ctx, 'threads')

  const threadId = await ctx.table('threads').insert({ userId: user._id, rid, private: true })
  return threadId
}

export const removeThread = async (ctx: MutationCtx, args: { threadId: string }) => {
  const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
  return id ? await ctx.table('threads').getX(id).delete() : null
}

export const renameThread = async (ctx: MutationCtx, args: { threadId: string; title: string }) => {
  const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
  return id ? await ctx.table('threads').getX(id).patch({ title: args.title }) : null
}

export const createMessage = async (
  ctx: MutationCtx,
  args: {
    threadId: string
    message: z.infer<typeof messageFieldsObject>
    inference?: InferenceSchema
  },
) => {
  const user = await ctx.viewerX()
  const threadId = ctx.unsafeDb.normalizeId('threads', args.threadId)
  insist(threadId, 'invalid thread id')

  const messageId = await ctx.table('messages').insert({
    threadId,
    ...args.message,
    rid: await generateRid(ctx, 'messages'),
    userId: user._id,
    private: false,
  })

  if (!args.inference) return messageId

  const targetMessageId =
    args.message.role === 'assistant'
      ? messageId
      : await ctx.table('messages').insert({
          threadId,
          role: 'assistant',
          rid: await generateRid(ctx, 'messages'),
          userId: user._id,
          private: false,
          inference: args.inference,
        })

  if (args.inference.type === 'chat-completion') {
    await createJob(ctx, { type: 'chat-completion', messageId: targetMessageId, threadId })
  } else {
    //create job
  }

  return targetMessageId
}
