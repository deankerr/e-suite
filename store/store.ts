import { createStore } from 'zustand/vanilla'

import { Id } from '@/convex/_generated/dataModel'

export type AppState = {
  navigationSidebarOpen: boolean
  sidebarOpen: boolean

  voiceoverMessageQueue: [Id<'messages'>, boolean][] | undefined
  voiceoverIsAutoplayEnabled: boolean
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

  voiceoverSetMessageQueue: (queue: [Id<'messages'>, boolean][] | undefined) => void
  voiceoverToggleIsAutoplayEnabled: (enabled?: boolean) => void
  voiceoverPlay: (messageId: Id<'messages'>) => void
  voiceoverStop: () => void
}

export type AppStore = AppState & AppActions

export const initAppStore = (): AppState => {
  return {
    navigationSidebarOpen: true,
    sidebarOpen: false,
    voiceoverMessageQueue: undefined,
    voiceoverIsAutoplayEnabled: false,
  }
}

export const defaultInitState: AppState = {
  navigationSidebarOpen: true,
  sidebarOpen: false,
  voiceoverMessageQueue: undefined,
  voiceoverIsAutoplayEnabled: false,
}

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
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
    voiceoverSetMessageQueue: (queue: [Id<'messages'>, boolean][] | undefined) =>
      set(() => ({ voiceoverMessageQueue: queue })),

    voiceoverToggleIsAutoplayEnabled: (enabled?: boolean) =>
      set((state) => ({
        voiceoverIsAutoplayEnabled: enabled ?? !state.voiceoverIsAutoplayEnabled,
      })),

    voiceoverPlay: (messageId: Id<'messages'>) =>
      set((state) => ({
        voiceoverMessageQueue: state.voiceoverMessageQueue?.map(([id]) =>
          messageId === id ? [id, true] : [id, false],
        ),
      })),

    voiceoverStop: () =>
      set((state) => ({
        voiceoverMessageQueue: state.voiceoverMessageQueue?.map(([id]) => [id, false]),
      })),
  }))
}
