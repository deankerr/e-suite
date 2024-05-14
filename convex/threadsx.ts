import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { mutation, query } from './functions'
import * as mutations from './threadsx/mutations'
import * as queries from './threadsx/queries'
import { zPaginationOptValidator } from './utils'
import { zThreadTitle } from './validators'

//* queries
export const getThread = query({
  args: {
    threadId: z.string(),
  },
  handler: queries.getThread,
})

export const listThreads = query({
  args: {},
  handler: queries.listThreads,
})

export const listMessages = query({
  args: {
    threadId: zid('threads'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: queries.listMessages,
})

//* mutations
export const createThread = mutation({
  args: {},
  handler: mutations.createThread,
})

export const removeThread = mutation({
  args: {
    threadId: z.string(),
  },
  handler: mutations.removeThread,
})

export const renameThread = mutation({
  args: {
    threadId: z.string(),
    title: zThreadTitle,
  },
  handler: mutations.renameThread,
})
