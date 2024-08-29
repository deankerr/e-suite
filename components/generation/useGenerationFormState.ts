import { useCallback } from 'react'
import { useSessionStorageValue } from '@react-hookz/web'

import { defaultImageModel } from '@/convex/shared/defaults'

type GenerationFormState = {
  modelId: string
  prompt: string
  negativePrompt: string
  quantity: number
  seed: number | undefined
  dimensions: string
  loras: { id: string; path: string; scale: number }[]
}

const defaultValue: GenerationFormState = {
  modelId: defaultImageModel,
  prompt: '',
  negativePrompt: '',
  quantity: 1,
  seed: undefined,
  dimensions: 'square',
  loras: [],
}

export const useGenerationFormState = (storageKey: string) => {
  const { set, ...rest } = useSessionStorageValue<GenerationFormState>(
    `generation-form-state-${storageKey}`,
    {
      defaultValue,
      initializeWithValue: false,
    },
  )

  const setState = useCallback(
    (state: Partial<GenerationFormState>) => {
      set((prev) => {
        return {
          ...defaultValue,
          ...prev,
          ...state,
        }
      })
    },
    [set],
  )

  return {
    ...rest,
    setState,
  }
}
