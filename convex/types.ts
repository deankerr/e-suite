import type { Doc, Id, TableNames } from './_generated/dataModel'
import type { getGeneration, imageReturnFields } from './db/images'
import type { messageReturnFields } from './db/messages'
import type { getChatModelByResourceKey } from './db/models'
import type { threadReturnFields } from './db/threads'
import type { getUserPublic } from './db/users'
import type { mutation, query } from './functions'
import type {
  entDefinitions,
  runConfigChatV,
  runConfigTextToAudioV,
  runConfigTextToImageV,
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
export type EImage = Infer<AsObjectValidator<typeof imageReturnFields>>
export type EImageMetadata = Doc<'images_metadata'>['data']
export type EImageGenerationData = Awaited<ReturnType<typeof getGeneration>>
export type EUser = Awaited<ReturnType<typeof getUserPublic>>

export type EChatModel = NonNullable<Awaited<ReturnType<typeof getChatModelByResourceKey>>>

export type RunConfig = Infer<typeof runConfigV>
export type RunConfigTextToImage = Infer<typeof runConfigTextToImageV>
export type RunConfigTextToImageV2 = Infer<typeof runConfigTextToImageV2>
export type RunConfigTextToAudio = Infer<typeof runConfigTextToAudioV>
export type RunConfigChat = Infer<typeof runConfigChatV>

export type ThreadActionResult = {
  threadId: Id<'threads'>
  slug: string
  messageId: string
  series: number
  jobIds?: string[]
}
