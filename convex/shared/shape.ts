import { pick } from 'convex-helpers'

import type { Doc } from '../_generated/dataModel'
import type { EMessage, EThread } from './types'

export function getMessageShape(message: Doc<'messages'>): EMessage {
  return pick(message, [
    '_id',
    '_creationTime',
    'threadId',
    'role',
    'name',
    'content',
    'inference',
    'series',
    'userId',
    'metadata',
  ])
}
export function getThreadShape(thread: Doc<'threads'>): EThread {
  return pick(thread, [
    '_id',
    '_creationTime',
    'title',
    'slug',
    'instructions',
    'config',
    'updatedAtTime',
    'userId',
    'metadata',
  ])
}

export type EChatModel = ReturnType<typeof getChatModelShape>
export function getChatModelShape(model: Doc<'chat_models'>) {
  return pick(model, [
    '_id',
    '_creationTime',
    'resourceKey',
    'name',
    'description',
    'creatorName',
    'link',
    'license',
    'tags',
    'numParameters',
    'contextLength',
    'tokenizer',
    'stop',
    'endpoint',
    'endpointModelId',
    'pricing',
    'moderated',
    'available',
    'hidden',
    'coverImageUrl',
  ])
}

export type EImageModel = ReturnType<typeof getImageModelShape>
export function getImageModelShape(model: Doc<'image_models'>) {
  return pick(model, [
    '_id',
    '_creationTime',
    'resourceKey',
    'name',
    'description',
    'creatorName',
    'link',
    'license',
    'tags',
    'endpoint',
    'endpointModelId',
    'pricing',
    'moderated',
    'available',
    'hidden',
    'sizes',
    'architecture',
    'civitaiModelId',
    'coverImageUrl',
  ])
}
