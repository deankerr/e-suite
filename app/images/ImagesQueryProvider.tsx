'use client'

import React, { createContext, useContext, useRef } from 'react'
import { useDebouncedEffect } from '@react-hookz/web'
import { usePaginatedQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import { useQueryState } from 'nuqs'

import { api } from '@/convex/_generated/api'
import { useImageGenerationBatches, useThreadImages } from '@/lib/api'

import type { UsePaginatedQueryReturnType } from 'convex/react'
import type { FunctionReturnType } from 'convex/server'

type ImagesQueryContextType = {
  imagesFeed: UsePaginatedQueryReturnType<typeof api.db.threads.listImages>
  galleryImages: FunctionReturnType<typeof api.db.images.getGenerationBatches> | undefined
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
export const ImagesQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams()
  const thread_id = params.thread_id as string
  const imageId = params.image_id as string

  const latestImages = useThreadImages(thread_id)
  const searchImages = useSearchParamValue(thread_id)

  const galleryImages = useImageGenerationBatches(imageId)

  const imagesFeed = searchImages ?? latestImages
  const value = {
    imagesFeed,
    galleryImages,
  }

  return <ImagesQueryContext.Provider value={value}>{children}</ImagesQueryContext.Provider>
}
