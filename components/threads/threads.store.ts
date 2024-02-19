import { atom, useAtom } from 'jotai'
import { atomFamily, useAtomCallback } from 'jotai/utils'
import { useCallback } from 'react'

export const paramValues = {
  message: { name: 'message', defaultValue: '' },
  model: { name: 'model', defaultValue: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO' },
  max_tokens: { name: 'max_tokens', min: 1, max: 2048, step: 1, defaultValue: 512 },
  temperature: { name: 'temperature', min: 0, max: 2, step: 0.1, defaultValue: 0.7 },
  top_p: { name: 'top_p', min: 0, max: 1, step: 0.1, defaultValue: 0.7 },
  top_k: { name: 'top_k', min: 1, max: 100, step: 1, defaultValue: 50 },
  repetition_penalty: { name: 'repetition_penalty', min: 1, max: 2, step: 0.01, defaultValue: 1 },
} as const

export type TextInputData = { name: string; defaultValue: string }
export type NumberInputData = {
  name: string
  min: number
  max: number
  step: number
  defaultValue: number
}

const threadsFamily = atomFamily((params: TextInputData | NumberInputData) =>
  atom(params.defaultValue),
)

export const useThreadsAtom = (params: TextInputData | NumberInputData) =>
  useAtom(threadsFamily(params))

export const useThreadAtomCallback = () => {
  const readValues = useAtomCallback(
    useCallback((get) => {
      const values = {
        message: get(threadsFamily(paramValues.message)),
        model: get(threadsFamily(paramValues.model)),
        max_tokens: get(threadsFamily(paramValues.max_tokens)),
        temperature: get(threadsFamily(paramValues.temperature)),
        top_p: get(threadsFamily(paramValues.top_p)),
        top_k: get(threadsFamily(paramValues.top_k)),
        repetition_penalty: get(threadsFamily(paramValues.repetition_penalty)),
      }

      return values
    }, []),
  )

  return readValues
}
