import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'

export const useAudio = (audioId: string) => {
  return useCachedQuery(api.db.audio.get, { audioId: audioId as Id<'audio'> })
}
