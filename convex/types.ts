import type { TableNames } from './_generated/dataModel'
import type { runConfigTextToImageV2 } from './db/generations'
import type { messageReturnFields } from './db/helpers/messages'
import type { threadReturnFields } from './db/helpers/threads'
import type { imagesReturn } from './db/images'
import type { getChatModelByResourceKey } from './db/models'
import type { userReturnFieldsPublic } from './db/users'
import type { mutation, query } from './functions'
import type { entDefinitions } from './schema'
import type { GenericEnt, GenericEntWriter } from 'convex-ents'
import type { CustomCtx } from 'convex-helpers/server/customFunctions'
import type { AsObjectValidator, Infer } from 'convex/values'

export type QueryCtx = CustomCtx<typeof query>
export type MutationCtx = CustomCtx<typeof mutation>
export type Ent<TableName extends TableNames> = GenericEnt<typeof entDefinitions, TableName>
export type EntWriter<TableName extends TableNames> = GenericEntWriter<
  typeof entDefinitions,
  TableName
>

export type EThread = Infer<AsObjectValidator<typeof threadReturnFields>>
export type EMessage = Infer<AsObjectValidator<typeof messageReturnFields>>
export type EImage = Infer<AsObjectValidator<typeof imagesReturn>>
export type EUser = Infer<AsObjectValidator<typeof userReturnFieldsPublic>>

export type EChatModel = NonNullable<Awaited<ReturnType<typeof getChatModelByResourceKey>>>

export type RunConfigTextToImageV2 = Infer<typeof runConfigTextToImageV2>
