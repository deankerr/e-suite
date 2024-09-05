import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@/convex/_generated/api'

export const useThreads = () => {
  const threads = useCachedQuery(api.db.threads.list, {})
  threads?.sort((a, b) => {
    if (a.favorite === true && b.favorite !== true) {
      return -1 // Favorites come first
    }
    if (b.favorite === true && a.favorite !== true) {
      return 1 // Favorites come first
    }
    return b.updatedAtTime - a.updatedAtTime // Then sort by updatedAtTime
  })
  return threads
}

export const useThread = (threadId: string) => {
  const threads = useThreads()
  const userThread = threads
    ? (threads?.find((thread) => thread.slug === threadId) ?? null)
    : undefined
  const otherThread = useCachedQuery(
    api.db.threads.get,
    !userThread ? { slugOrId: threadId } : 'skip',
  )

  return userThread ?? otherThread
}
