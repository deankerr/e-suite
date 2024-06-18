import { Doc } from '../_generated/dataModel'

import type { api } from '../_generated/api'
import type { getMessageEdges } from '../db/messages'
import type { FunctionReturnType } from 'convex/server'

export type EThread = Omit<Doc<'threads'>, '_id' | 'userId'> & { _id: string; userId: string }
export type EMessage = Awaited<ReturnType<typeof getMessageEdges>>
export type EChatModel = Doc<'chat_models'>
export type EImageModel = Doc<'image_models'>

// export type EThread = {
//   _id: string
//   _creationTime: number

//   title?: string
//   slug: string
//   instructions?: string

//   config: {
//     ui: EInferenceConfig
//     saved: {
//       inference: EInferenceConfig
//       name: string
//       command?: string
//     }[]
//   }

//   updatedAtTime: number
//   userId: string
// }

// export type EMessage = {
//   _id: string
//   _creationTime: number
//   threadId: string
//   series: number

//   role: EMessageRole
//   name?: string
//   content?: string

//   inference?: EInferenceConfig
//   files?: EFileAttachmentRecordWithContent[]
//   metadata?: { key: string; value: string }[]

//   userId: string

//   jobs?: Doc<'jobs'>[]
//   speechId?: string
//   speech?: Doc<'speech'> | null
//   voiceover?: Doc<'messages'>['voiceover']
// }
