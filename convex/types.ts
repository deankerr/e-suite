import type { Doc, Id, TableNames } from './_generated/dataModel'
import type { getMessageEdges } from './db/messages'
import type {
  getChatModelByResourceKey,
  getImageModelByResourceKey,
  getVoiceModels,
} from './db/models'
import type { getThreadExtras } from './db/threads'
import type { mutation, query } from './functions'
import type {
  chatCompletionConfigV,
  entDefinitions,
  inferenceConfigV,
  jobErrorV,
  runConfigChatV,
  runConfigTextToAudioV,
  runConfigTextToImageV,
  runConfigV,
  soundGenerationConfigV,
  textToImageConfigV,
} from './schema'
import type { getViewer } from './users'
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

export type EThread = Omit<Awaited<ReturnType<typeof getThreadExtras>>, '_id' | 'userId'> & {
  _id: string
  userId: string
}
export type EMessage = Awaited<ReturnType<typeof getMessageEdges>>
export type EImage = Doc<'images'>
export type EUser = Awaited<ReturnType<typeof getViewer>>

export type EChatModel = NonNullable<Awaited<ReturnType<typeof getChatModelByResourceKey>>>
export type EImageModel = NonNullable<Awaited<ReturnType<typeof getImageModelByResourceKey>>>
export type EVoiceModel = Awaited<ReturnType<typeof getVoiceModels>>[number]
export type EModel = EChatModel | EImageModel | EVoiceModel

export type ChatCompletionConfig = Infer<typeof chatCompletionConfigV>
export type TextToImageConfig = Infer<typeof textToImageConfigV>
export type TextToAudioConfig = Infer<typeof soundGenerationConfigV>
export type InferenceConfig = Infer<typeof inferenceConfigV>

export type RunConfig = Infer<typeof runConfigV>
export type RunConfigTextToImage = Infer<typeof runConfigTextToImageV>
export type RunConfigTextToAudio = Infer<typeof runConfigTextToAudioV>
export type RunConfigChat = Infer<typeof runConfigChatV>

export type ThreadActionResult = {
  threadId: Id<'threads'>
  slug: string
  messageId: string
  jobId?: Id<'jobs'>
}

export type JobError = Infer<typeof jobErrorV>
export type TextToImageHandlerResult =
  | {
      images: {
        url: string
      }[]
      error: undefined
    }
  | {
      images: undefined
      error: JobError
    }
