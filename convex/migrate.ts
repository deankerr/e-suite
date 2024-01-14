import { internalMutation } from './_generated/server'

export const addUrlsToImages = internalMutation(async (ctx) => {
  const images = await ctx.db.query('images').collect()
  for (const i of images) {
    const source = i.source
    if (!source) continue
    const url = await ctx.storage.getUrl(source.storageId)
    await ctx.db.patch(i._id, { source: { ...source, url } })
  }
})
