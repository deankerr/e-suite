import type { Id, TableNames } from './_generated/dataModel'
import type { imagesReturn } from './db/images'
import type { messageReturnFields } from './db/messages'
import type { getChatModelByResourceKey } from './db/models'
import type { threadReturnFields } from './db/threads'
import type { userReturn } from './db/users'
import type { mutation, query } from './functions'
import type {
  entDefinitions,
  runConfigChatV,
  runConfigTextToAudioV,
  runConfigTextToImageV2,
  runConfigV,
} from './schema'
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
export type EUser = Infer<AsObjectValidator<typeof userReturn>>

export type EChatModel = NonNullable<Awaited<ReturnType<typeof getChatModelByResourceKey>>>

export type RunConfig = Infer<typeof runConfigV>
export type RunConfigTextToImageV2 = Infer<typeof runConfigTextToImageV2>
export type RunConfigTextToAudio = Infer<typeof runConfigTextToAudioV>
export type RunConfigChat = Infer<typeof runConfigChatV>
