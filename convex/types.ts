import { mutation, query } from './functions'
import { entDefinitions } from './schema'

import type { TableNames } from './_generated/dataModel'
import type { GenericEnt, GenericEntWriter } from 'convex-ents'
import type { CustomCtx } from 'convex-helpers/server/customFunctions'

export type QueryCtx = CustomCtx<typeof query>
export type MutationCtx = CustomCtx<typeof mutation>

export type Ent<TableName extends TableNames> = GenericEnt<typeof entDefinitions, TableName>
export type EntWriter<TableName extends TableNames> = GenericEntWriter<
  typeof entDefinitions,
  TableName
>

export type CollectionItem<T extends object = {}> = { id: string; name: string } & T
export type CollectionGroup<T extends object = {}> = {
  id: string
  name: string
  group: CollectionItem<T>[]
}
export type Collection<T extends object = {}> = (CollectionItem<T> | CollectionGroup<T>)[]
