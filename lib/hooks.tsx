import { useDocumentTitle, useLocalStorage } from '@uidotdev/usehooks'
import { button, useControls } from 'leva'

import type { Id } from '@/convex/_generated/dataModel'
import type { GenerationVoteNames } from '@/convex/external'

export const useTitle = (subtitle?: string) => {
  useDocumentTitle(`e/suite${subtitle ? ` / ${subtitle}` : ''}`)
}

type VoteCache = {
  constituent?: string
  votes: Record<Id<'generations'>, GenerationVoteNames>
}

export const useLocalOwnVotesCache = () => {
  const [voteCache, setVoteCache] = useLocalStorage<VoteCache>('voteCache', { votes: {} })

  const debugcache = JSON.stringify(voteCache)

  const [{ cache }, set] = useControls('cache', () => ({
    cache: { value: debugcache, rows: 5, editable: false },
    purge: button(() => setVoteCache({ votes: {} })),
  }))
  if (debugcache !== cache) set({ cache })

  return [voteCache, setVoteCache] as const
}
