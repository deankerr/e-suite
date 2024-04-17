import { entDefinitions } from './schema'

import type { TableNames } from './_generated/dataModel'
import type { authOnlyMutation, authOnlyQuery } from './functions'
import type { GenericEnt, GenericEntWriter } from 'convex-ents'
import type { CustomCtx } from 'convex-helpers/server/customFunctions'
import type { SystemDataModel } from 'convex/server'
import type OpenAI from 'openai'

export type QueryCtx = CustomCtx<typeof authOnlyQuery>
export type MutationCtx = CustomCtx<typeof authOnlyMutation>

export type Ent<TableName extends TableNames> = GenericEnt<typeof entDefinitions, TableName>
export type EntWriter<TableName extends TableNames> = GenericEntWriter<
  typeof entDefinitions,
  TableName
>

export type ScheduledFunction = SystemDataModel['_scheduled_functions']['document']
export type JobStatus = ScheduledFunction['state']['kind'] | 'unknown'

export type CollectionItem<T extends object> = { id: string; name: string } & T
export type CollectionGroup<T extends object> = {
  id: string
  name: string
  group: CollectionItem<T>[]
}
export type Collection<T extends object> = (CollectionItem<T> | CollectionGroup<T>)[]

export type ChatMessage =
  | OpenAI.ChatCompletionSystemMessageParam
  | OpenAI.ChatCompletionAssistantMessageParam
  | OpenAI.ChatCompletionUserMessageParam
