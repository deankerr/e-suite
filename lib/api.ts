import { useMutation, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

export const useCreateThread = () => useMutation(api.threads.mutate.createThread)
export const useUpdateThreadTitle = () => useMutation(api.threads.mutate.updateThreadTitle)
export const useRemoveThread = () => useMutation(api.threads.mutate.removeThread)

export const useUpdateThreadConfig = () => {
  const update = useMutation(api.threads.mutate.updateThreadConfig)
  const updateOptimistic = useMutation(api.threads.mutate.updateThreadConfig).withOptimisticUpdate(
    (localStore, args) => {
      const currentValue = localStore.getQuery(api.threads.query.getThreadContent, {
        slugOrId: args.threadId,
      })
      if (currentValue) {
        localStore.setQuery(
          api.threads.query.getThreadContent,
          { slugOrId: args.threadId },
          { ...currentValue, config: args.config },
        )
      }
    },
  )

  const updateThreadConfigOptimistic = (args: Parameters<typeof updateOptimistic>[0]) => {
    updateOptimistic(args)
      .then(() => {
        toast.success('Thread config updated.')
      })
      .catch((err) => {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Failed to update config.')
      })
  }

  return { update, updateOptimistic, updateThreadConfig: updateThreadConfigOptimistic }
}

export const useUpdateThreadInstructions = () => {
  const update = useMutation(api.threads.mutate.updateThreadInstructions).withOptimisticUpdate(
    (localStore, args) => {
      const currentValue = localStore.getQuery(api.threads.query.getThreadContent, {
        slugOrId: args.threadId,
      })
      if (currentValue) {
        localStore.setQuery(
          api.threads.query.getThreadContent,
          { slugOrId: args.threadId },
          { ...currentValue, instructions: args.instructions },
        )
      }
    },
  )

  return {
    update,
    updateThreadInstructions: (args: Parameters<typeof update>[0]) => {
      update(args)
        .then(() => {
          toast.success('Thread instructions updated.')
        })
        .catch((err) => {
          if (err instanceof Error) toast.error(err.message)
          else toast.error('Failed to update instructions.')
        })
    },
  }
}

export const useCreateMessage = () => useMutation(api.threads.mutate.createMessage)
export const useEditMessage = () => useMutation(api.threads.mutate.editMessage)
export const useRemoveMessage = () => useMutation(api.threads.mutate.removeMessage)

export const useViewer = () => useQuery(api.users.getViewer, {})

export const useViewerDetails = (ownerId?: string) => {
  const user = useQuery(api.users.getViewer, {})
  const isOwner = user?._id === ownerId
  const isAdmin = user?.role === 'admin'
  return { user, isOwner, isAdmin }
}

export const useThreadContent = (slugOrId?: string) => {
  const thread = useQuery(api.threads.query.getThreadContent, slugOrId ? { slugOrId } : 'skip')
  return thread
}

export const useThreadIndexContent = (index?: [string, string, string]) => {
  const thread = useQuery(api.threads.query.getThreadIndexContent, index ? { index } : 'skip')
  return thread
}

export const useListThreads = () => {
  const threads = useQuery(api.threads.query.listThreads, {})
  return threads
}

//* new hooks
