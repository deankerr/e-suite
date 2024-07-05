import type { Doc, TableNames } from './_generated/dataModel'
import type { getMessageEdges } from './db/messages'
import type { getThreadExtras } from './db/threads'
import type { getVoiceModels } from './db/voiceModels'
import type { mutation, query } from './functions'
import type {
  chatCompletionConfigV,
  entDefinitions,
  inferenceConfigV,
  jobErrorV,
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

export type EChatModel = Doc<'chat_models'>
export type EImageModel = Doc<'image_models'>
export type EVoiceModel = Awaited<ReturnType<typeof getVoiceModels>>[number]

export type ChatCompletionConfig = Infer<typeof chatCompletionConfigV>
export type TextToImageConfig = Infer<typeof textToImageConfigV>
export type SoundGenerationConfig = Infer<typeof soundGenerationConfigV>
export type InferenceConfig = Infer<typeof inferenceConfigV>

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
