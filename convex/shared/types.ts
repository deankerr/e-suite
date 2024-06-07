import type { EFileAttachmentRecordWithContent, EInferenceConfig, EMessageRole } from './structures'

export type E_Thread = {
  _id: string
  _creationTime: number

  title?: string
  slug: string
  instructions?: string

  currentInferenceConfig?: EInferenceConfig
  savedInferenceConfigs?: {
    inference: EInferenceConfig
    name: string
    command?: string
  }[]

  updatedAtTime: number
  userId: string
}

export type E_Message = {
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
}
