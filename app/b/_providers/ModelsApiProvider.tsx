'use client'

import { createContext, useContext } from 'react'
import { useQueries } from 'convex/react'

import { api } from '@/convex/_generated/api'

import type { FunctionReturnType } from 'convex/server'

const queryKeys = {
  chatModels: { query: api.db.models.listChatModels, args: {} },
  imageModels: { query: api.db.models.listImageModels, args: {} },
  voiceModels: { query: api.db.models.listVoiceModels, args: {} },
}

const useCreateModelsApiContext = () => {
  const queries = useQueries(queryKeys)

  return queries as {
    chatModels: FunctionReturnType<typeof api.db.models.listChatModels> | undefined
    imageModels: FunctionReturnType<typeof api.db.models.listImageModels> | undefined
    voiceModels: FunctionReturnType<typeof api.db.models.listVoiceModels> | undefined
  }
}

type ModelsApiContext = ReturnType<typeof useCreateModelsApiContext>
const ModelsApiContext = createContext<ModelsApiContext | undefined>(undefined)

export const ModelsApiProvider = ({ children }: { children: React.ReactNode }) => {
  const api = useCreateModelsApiContext()

  return <ModelsApiContext.Provider value={api}>{children}</ModelsApiContext.Provider>
}

export const useModelsApi = (): ModelsApiContext => {
  const context = useContext(ModelsApiContext)
  if (!context) {
    throw new Error('useModelsApi must be used within a ModelsApiProvider')
  }
  return context
}
