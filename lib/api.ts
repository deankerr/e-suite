import { useMutation, usePreloadedQuery, useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'

import type { Preloaded } from 'convex/react'

export const usePreloadedThreads = (
  preloadedThreads: Preloaded<typeof api.threads.query.listThreads>,
) => {
  const threads = usePreloadedQuery(preloadedThreads)
  return threads
}

// const emptyThreadIndex: ThreadIndex = { thread: '', message: '', file: '', keys: ['', '', ''] }

// export const useThreadIndex = (index: ThreadIndex = emptyThreadIndex) => {
//   const queryKey = index.thread ? { slug: index.thread } : 'skip'
//   const thread = useQuery(api.threads.query.getThread, queryKey)

//   const listMessagesQueryKey = index.thread && !index.message ? { slug: index.thread } : 'skip'
//   const messages = usePaginatedQuery(api.threads.query.listMessages, listMessagesQueryKey, {
//     initialNumItems: 8,
//   })

//   const getMessageSeriesQueryKey =
//     index.thread && index.message ? { slug: index.thread, series: index.message } : 'skip'
//   const series = useQuery(api.threads.query.getMessageSeries, getMessageSeriesQueryKey)

//   const file = Number(index.file) ? Number(index.file) : undefined
//   return { thread, messages, series, file }
// }

// export const useThread = (slug?: string) => {
//   const routeIndex = useRouteIndex()
//   const queryKey = slug ? { slug } : routeIndex.thread ? { slug: routeIndex.thread } : 'skip'
//   const thread = useQuery(api.threads.query.getThread, queryKey)

//   return thread
// }

export const useThreads = () => {
  const threads = useQuery(api.threads.query.listThreads, {})
  return threads
}

export const useCreateThread = () => useMutation(api.threads.mutate.createThread)
export const useUpdateThreadTitle = () => useMutation(api.threads.mutate.updateThreadTitle)
export const useRemoveThread = () => useMutation(api.threads.mutate.removeThread)

export const useCreateMessage = () => useMutation(api.threads.mutate.createMessage)
export const useEditMessage = () => useMutation(api.threads.mutate.editMessage)
export const useRemoveMessage = () => useMutation(api.threads.mutate.removeMessage)

export const useImageModelList = () => useQuery(api.bmodels.listImageModels, {})
export const useChatModelList = () => useQuery(api.bmodels.listChatModels, {})

// TODO remove useSelf
export const useSelf = () => useQuery(api.users.getViewer, {})
export const useViewer = () => useQuery(api.users.getViewer, {})

export const useThreadContent = (slugOrId?: string) => {
  const thread = useQuery(api.threads.query.getThreadContent, slugOrId ? { slugOrId } : 'skip')
  return thread
}

export const usePreloadedListViewerThreads = (
  preloadedList: Preloaded<typeof api.threads.query.listViewerThreads>,
) => {
  const result = usePreloadedQuery(preloadedList)
  return result
}

export const useListThreads = () => {
  const threads = useQuery(api.threads.query.listThreads, {})
  return threads
}

export const useUpdateCurrentInferenceConfig = () =>
  useMutation(api.threads.mutate.updateCurrentInferenceConfig)
