import { useDocumentTitle, useLocalStorage } from '@uidotdev/usehooks'
import { button, useControls } from 'leva'

import type { Id } from '@/convex/_generated/dataModel'
import type { GenerationVoteNames } from '@/convex/external'

export const useTitle = (subtitle?: string) => {
  useDocumentTitle(`e/suite${subtitle ? ` / ${subtitle}` : ''}`)
}

export const useLocalOwnVotesCache = () => {
  const [ownVotesCache, setOwnVotesCache] = useLocalStorage<
    Record<Id<'generations'>, GenerationVoteNames>
  >('votes', {})

  const debugcache = JSON.stringify(ownVotesCache, null, 2)

  const [_, set] = useControls('cache', () => ({
    cache: { value: debugcache, rows: 5, editable: false },
    purge: button(() => setOwnVotesCache({})),
  }))
  set({ cache: debugcache })

  return [ownVotesCache, setOwnVotesCache] as const
}
