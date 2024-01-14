import { Id } from './_generated/dataModel'
import { internalMutation, query } from './_generated/server'

export const addTempTableFile = internalMutation(
  async (ctx, { fileId }: { fileId: Id<'_storage'> }) => {
    return await ctx.db.insert('tempFileTable', { fileId })
  },
)

export const tempFilesUrls = query(async (ctx) => {
  const files = await ctx.db.query('tempFileTable').collect()
  return await Promise.all(
    files.map(async (file) => (await ctx.storage.getUrl(file.fileId)) ?? 'nourl'),
  )
})
