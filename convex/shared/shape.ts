// import { pick } from 'convex-helpers'

// import type { Doc } from '../_generated/dataModel'
// import type { EMessage, EThread } from './types'

// export function getMessageShape(message: Doc<'messages'>) {
//   return pick(message, [
//     '_id',
//     '_creationTime',
//     'series',

//     'role',
//     'name',
//     'content',

//     'inference',
//     // 'files',
//     'metadata',

//     'speechId',
//     'threadId',
//     'userId',

//     'voiceover',
//   ])
// }

// export function getThreadShape(thread: Doc<'threads'>) {
//   return pick(thread, [
//     '_id',
//     '_creationTime',
//     'title',
//     'slug',
//     'instructions',
//     'config',
//     'updatedAtTime',
//     'userId',
//     'metadata',
//   ])
// }

// export type EChatModel = ReturnType<typeof getChatModelShape>
// export function getChatModelShape(model: Doc<'chat_models'>) {
//   return model
// }

// export type EImageModel = ReturnType<typeof getImageModelShape>
// export function getImageModelShape(model: Doc<'image_models'>) {
//   return model
// }
