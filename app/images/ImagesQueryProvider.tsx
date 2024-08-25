'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useDebouncedState } from '@react-hookz/web'
import { usePaginatedQuery } from 'convex/react'
import { useQueryState } from 'nuqs'

import { api } from '@/convex/_generated/api'
import { useThreadImages } from '@/lib/api'

import type { UsePaginatedQueryReturnType } from 'convex/react'

type ImagesQueryContextType = {
  latestImages: UsePaginatedQueryReturnType<typeof api.db.threads.listImages>
  searchImages: UsePaginatedQueryReturnType<typeof api.db.threads.searchImages>
}

const ImagesQueryContext = createContext<ImagesQueryContextType | undefined>(undefined)

export const useSearchParamValue = (slug?: string, initialNumItems = 3) => {
  const [searchParamValue] = useQueryState('search', {
    defaultValue: '',
    clearOnDefault: true,
  })

  const [queryValue, setQueryValue] = useDebouncedState(searchParamValue, 300)

  useEffect(() => {
    if (searchParamValue) {
      setQueryValue(searchParamValue)
    }
  }, [searchParamValue, setQueryValue])

  const images = usePaginatedQuery(
    api.db.threads.searchImages,
    slug && queryValue ? { slugOrId: slug, query: queryValue } : 'skip',
    {
      initialNumItems,
    },
  )

  return images
}

export const useImagesQueryContext = () => {
  const context = useContext(ImagesQueryContext)
  if (!context) {
    throw new Error('useImagesQuery must be used within an ImagesQueryProvider')
  }
  return context
}

// Provider component
export const ImagesQueryProvider = ({
  thread_id,
  children,
}: {
  thread_id: string
  children: React.ReactNode
}) => {
  const latestImages = useThreadImages(thread_id)
  const searchImages = useSearchParamValue(thread_id)

  const value = {
    latestImages,
    searchImages,
  }

  return <ImagesQueryContext.Provider value={value}>{children}</ImagesQueryContext.Provider>
}
