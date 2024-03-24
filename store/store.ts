import { createStore } from 'zustand/vanilla'

export type AppState = {
  sidebarOpen: boolean
}

export type AppActions = {
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
  updateSidebarOpen: (open: boolean) => void
}

export type AppStore = AppState & AppActions

export const initAppStore = (): AppState => {
  return { sidebarOpen: false }
}

export const defaultInitState: AppState = {
  sidebarOpen: false,
}

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    openSidebar: () => set(() => ({ sidebarOpen: true })),
    closeSidebar: () => set(() => ({ sidebarOpen: false })),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    updateSidebarOpen: (open: boolean) => set(() => ({ sidebarOpen: open })),
  }))
}
