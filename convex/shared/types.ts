import type { EFileAttachmentRecord, EInferenceAttachment, EMessageRole } from './structures'

export type E_Thread = {
  _id: string
  _creationTime: number

  title?: string
  slug: string
  instructions?: string

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

  inference?: EInferenceAttachment
  files?: EFileAttachmentRecord[]

  userId: string
}
