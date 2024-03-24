import { createStore } from 'zustand/vanilla'

export type AppState = {
  navigationSidebarOpen: boolean
  sidebarOpen: boolean
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
}

export type AppStore = AppState & AppActions

export const initAppStore = (): AppState => {
  return {
    navigationSidebarOpen: true,
    sidebarOpen: false,
  }
}

export const defaultInitState: AppState = {
  navigationSidebarOpen: true,
  sidebarOpen: false,
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
  }))
}
