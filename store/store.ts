import { api } from '@/convex/_generated/api'
import type { FunctionReturnType } from 'convex/server'
import { createStore } from 'zustand/vanilla'

export type AppState = {
  navigationSidebarOpen: boolean
  sidebarOpen: boolean
  headerTitle: React.ReactNode

  threadsList: FunctionReturnType<typeof api.threads.threads.list>
  generationsList: FunctionReturnType<typeof api.generations.do.list>
}

export type AppActions = {
  openNavigationSidebar: () => void
  closeNavigationSidebar: () => void
  toggleNavigationSidebar: () => void
  updateNavigationSidebarOpen: (open: boolean) => void
  // sidebar state
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
  updateSidebarOpen: (open: boolean) => void
  // title
  updateHeaderTitle: (title: React.ReactNode) => void

  updateThreadsList: (threadsList: FunctionReturnType<typeof api.threads.threads.list>) => void
  updateGenerationsList: (
    generationsList: FunctionReturnType<typeof api.generations.do.list>,
  ) => void
}

export type AppStore = AppState & AppActions

export const initAppStore = (): AppState => {
  return {
    navigationSidebarOpen: true,
    sidebarOpen: false,
    headerTitle: 'Default Title',
    threadsList: [],
    generationsList: [],
  }
}

export const defaultInitState: AppState = {
  navigationSidebarOpen: true,
  sidebarOpen: false,
  headerTitle: 'Default Title',
  threadsList: [],
  generationsList: [],
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
    updateHeaderTitle: (title: React.ReactNode) => set(() => ({ headerTitle: title })),
    updateThreadsList: (threadsList: FunctionReturnType<typeof api.threads.threads.list>) =>
      set(() => ({ threadsList })),
    updateGenerationsList: (generationsList: FunctionReturnType<typeof api.generations.do.list>) =>
      set(() => ({ generationsList })),
  }))
}
