import type { Doc, Id, TableNames } from './_generated/dataModel'
import type { getGeneration, getImageWithEdges } from './db/images'
import type { getMessageEdges } from './db/messages'
import type {
  getChatModelByResourceKey,
  getImageModelByResourceKey,
  getVoiceModels,
} from './db/models'
import type { getThreadEdges } from './db/threads'
import type { getUserPublic } from './db/users'
import type { mutation, query } from './functions'
import type {
  entDefinitions,
  runConfigChatV,
  runConfigTextToAudioV,
  runConfigTextToImageV,
  runConfigV,
} from './schema'
import type { GenericEnt, GenericEntWriter } from 'convex-ents'
import type { CustomCtx } from 'convex-helpers/server/customFunctions'
import type { Infer } from 'convex/values'

export type QueryCtx = CustomCtx<typeof query>
export type MutationCtx = CustomCtx<typeof mutation>
export type Ent<TableName extends TableNames> = GenericEnt<typeof entDefinitions, TableName>
export type EntWriter<TableName extends TableNames> = GenericEntWriter<
  typeof entDefinitions,
  TableName
>

export type EThread = Omit<Awaited<ReturnType<typeof getThreadEdges>>, '_id' | 'userId'> & {
  _id: string
  userId: string
}
export type EMessage = Awaited<ReturnType<typeof getMessageEdges>>
export type EImage = NonNullable<Awaited<ReturnType<typeof getImageWithEdges>>>
export type EImageMetadata = Doc<'images_metadata'>['data']
export type EImageGenerationData = Awaited<ReturnType<typeof getGeneration>>
export type EUser = Awaited<ReturnType<typeof getUserPublic>>

export type EChatModel = NonNullable<Awaited<ReturnType<typeof getChatModelByResourceKey>>>
export type EImageModel = NonNullable<Awaited<ReturnType<typeof getImageModelByResourceKey>>>
export type EVoiceModel = Awaited<ReturnType<typeof getVoiceModels>>[number]
export type EModel = EChatModel | EImageModel | EVoiceModel

export type RunConfig = Infer<typeof runConfigV>
export type RunConfigTextToImage = Infer<typeof runConfigTextToImageV>
export type RunConfigTextToAudio = Infer<typeof runConfigTextToAudioV>
export type RunConfigChat = Infer<typeof runConfigChatV>

export type ThreadActionResult = {
  threadId: Id<'threads'>
  slug: string
  messageId: string
  series: number
  jobIds?: (Id<'jobs3'> | Id<'generations_v1'>)[]
}
