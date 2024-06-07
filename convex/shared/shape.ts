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
    'currentInferenceConfig',
    'savedInferenceConfigs',
    'updatedAtTime',
    'userId',
    'metadata',
  ])
}
