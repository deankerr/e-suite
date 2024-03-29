import { devtools } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import type {} from '@redux-devtools/extension' // required for devtools typing

import type { Id } from '@/convex/_generated/dataModel'

export type AppState = {
  navigationSidebarOpen: boolean
  sidebarOpen: boolean

  voiceoverAutoplayEnabled: boolean
  voiceoverPlayingMessageId?: Id<'messages'>
  voiceoverAutoplayQueue?: Id<'messages'>[]
  voiceoverAutoplayIndex: number
}

export type AppActions = {
  openNavigationSidebar: () => void
  closeNavigationSidebar: () => void
  toggleNavigationSidebar: () => void
  updateNavigationSidebarOpen: (open: boolean) => void

  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
  updateSidebarOpen: (open: boolean) => void

  voiceoverToggleAutoplay: (enabled?: boolean) => void
  voiceoverEnqueueMessages: (messageIds: Id<'messages'>[]) => void
  voiceoverPlay: (messageId: Id<'messages'>) => void
  voiceoverEnded: () => void
  voiceoverStop: () => void

  voiceoverCleanup: () => void
}

export type AppStore = AppState & AppActions

export const initAppStore = (): AppState => {
  return {
    navigationSidebarOpen: true,
    sidebarOpen: false,
    voiceoverPlayingMessageId: undefined,
    voiceoverAutoplayEnabled: false,
    voiceoverAutoplayQueue: undefined,
    voiceoverAutoplayIndex: 0,
  }
}

export const defaultInitState: AppState = {
  navigationSidebarOpen: true,
  sidebarOpen: false,
  voiceoverPlayingMessageId: undefined,
  voiceoverAutoplayEnabled: false,
  voiceoverAutoplayQueue: undefined,
  voiceoverAutoplayIndex: 0,
}

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()(
    devtools((set) => ({
      ...initState,
      openNavigationSidebar: () => set(() => ({ navigationSidebarOpen: true })),
      closeNavigationSidebar: () => set(() => ({ navigationSidebarOpen: false })),
      toggleNavigationSidebar: () =>
        set((state) => ({ navigationSidebarOpen: !state.navigationSidebarOpen })),
      updateNavigationSidebarOpen: (open: boolean) => set(() => ({ navigationSidebarOpen: open })),

      openSidebar: () => set(() => ({ sidebarOpen: true })),
      closeSidebar: () => set(() => ({ sidebarOpen: false })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      updateSidebarOpen: (open: boolean) => set(() => ({ sidebarOpen: open })),

      // voiceover
      voiceoverToggleAutoplay: (enabled?: boolean) =>
        set((state) => ({
          voiceoverAutoplayEnabled: enabled ?? !state.voiceoverAutoplayEnabled,
          voiceoverAutoplayIndex: state.voiceoverAutoplayQueue?.length ?? 0,
        })),

      voiceoverEnqueueMessages: (messageIds: Id<'messages'>[]) =>
        set((state) => {
          if (!state.voiceoverAutoplayQueue) {
            // initial load, set index to end to avoid playing all voiceovers
            return {
              voiceoverAutoplayQueue: messageIds,
              voiceoverAutoplayIndex: messageIds.length,
            }
          }
          const voiceoverAutoplayQueue = [
            ...new Set([...state.voiceoverAutoplayQueue, ...messageIds]),
          ]
          return {
            voiceoverAutoplayQueue,
            voiceoverAutoplayIndex: state.voiceoverAutoplayEnabled
              ? state.voiceoverAutoplayIndex
              : voiceoverAutoplayQueue.length,
          }
        }),

      voiceoverPlay: (messageId: Id<'messages'>) =>
        set(() => ({ voiceoverPlayingMessageId: messageId })),

      voiceoverEnded: () =>
        set((state) => ({
          voiceoverPlayingMessageId: undefined,
          voiceoverAutoplayIndex: state.voiceoverPlayingMessageId
            ? state.voiceoverAutoplayIndex
            : state.voiceoverAutoplayIndex + 1,
        })),

      voiceoverStop: () =>
        set((state) => ({
          voiceoverPlayingMessageId: undefined,
          voiceoverAutoplayEnabled: false,
          voiceoverAutoplayIndex: state.voiceoverAutoplayQueue?.length ?? 0,
        })),

      voiceoverCleanup: () =>
        set(() => ({
          voiceoverAutoplayQueue: undefined,
          voiceoverPlayingMessageId: undefined,
          voiceoverAutoplayIndex: 0,
        })),
    })),
  )
}
