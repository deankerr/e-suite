import { TableNames } from './_generated/dataModel'
import { internalMutation } from './functions'

export const destroyTable = internalMutation(async (ctx, { table }: { table: TableNames }) => {
  const rows = await ctx.unsafeDb.query(table).take(4000)
  await Promise.all(rows.map(async (row) => await ctx.unsafeDb.delete(row._id)))
})
