import type { EFileAttachmentRecordWithContent, EInference, EMessageRole } from './structures'

export type E_Thread = {
  _id: string
  _creationTime: number

  title?: string
  slug: string
  instructions?: string
  config: EInference

  latestActivityTime: number
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

  inference?: EInference
  files?: EFileAttachmentRecordWithContent[]
  metadata?: { key: string; value: string }[]

  userId: string
}
