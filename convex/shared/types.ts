import type { Doc } from '../_generated/dataModel'
import type { EFileAttachmentRecordWithContent, EInferenceConfig, EMessageRole } from './structures'

export type EThread = {
  _id: string
  _creationTime: number

  title?: string
  slug: string
  instructions?: string

  config: {
    ui: EInferenceConfig
    saved: {
      inference: EInferenceConfig
      name: string
      command?: string
    }[]
  }

  updatedAtTime: number
  userId: string
}

export type EMessage = {
  _id: string
  _creationTime: number
  threadId: string
  series: number

  role: EMessageRole
  name?: string
  content?: string

  inference?: EInferenceConfig
  files?: EFileAttachmentRecordWithContent[]
  metadata?: { key: string; value: string }[]

  userId: string

  speechId?: string
  speech?: Doc<'speech'> | null
  jobs?: Doc<'jobs'>[]
}
