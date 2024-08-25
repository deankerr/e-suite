'use client'

import React, { createContext, useContext, useRef } from 'react'
import { useDebouncedEffect } from '@react-hookz/web'
import { usePaginatedQuery } from 'convex/react'
import { useQueryState } from 'nuqs'

import { api } from '@/convex/_generated/api'
import { useThreadImages } from '@/lib/api'

import type { UsePaginatedQueryReturnType } from 'convex/react'

type ImagesQueryContextType = {
  imagesFeed: UsePaginatedQueryReturnType<typeof api.db.threads.listImages>
}

const ImagesQueryContext = createContext<ImagesQueryContextType | undefined>(undefined)

export const useSearchParamValue = (slug?: string, initialNumItems = 3) => {
  const [searchParamValue] = useQueryState('search', {
    defaultValue: '',
    clearOnDefault: true,
  })
  const queryValue = useRef(searchParamValue)

  useDebouncedEffect(
    () => {
      if (searchParamValue) {
        queryValue.current = searchParamValue
      }
    },
    [searchParamValue],
    300,
  )

  const images = usePaginatedQuery(
    api.db.threads.searchImages,
    slug && queryValue.current ? { slugOrId: slug, query: queryValue.current } : 'skip',
    {
      initialNumItems,
    },
  )

  return queryValue.current ? images : undefined
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

  const imagesFeed = searchImages ?? latestImages
  const value = {
    imagesFeed,
  }

  return <ImagesQueryContext.Provider value={value}>{children}</ImagesQueryContext.Provider>
}
