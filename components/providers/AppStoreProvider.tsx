'use client'

import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { createAppStore, initAppStore } from '@/store/store'

import type { AppStore } from '@/store/store'
import type { ReactNode } from 'react'
import type { StoreApi } from 'zustand'

export const AppStoreContext = createContext<StoreApi<AppStore> | null>(null)

export interface AppStoreProviderProps {
  children: ReactNode
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
  const storeRef = useRef<StoreApi<AppStore>>()
  if (!storeRef.current) {
    storeRef.current = createAppStore(initAppStore())
  }

  return <AppStoreContext.Provider value={storeRef.current}>{children}</AppStoreContext.Provider>
}

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
  const appStoreContext = useContext(AppStoreContext)

  if (!appStoreContext) {
    throw new Error(`useAppStore must be use within AppStoreProvider`)
  }

  return useStore(appStoreContext, selector)
}
