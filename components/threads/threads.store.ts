import { atom, useAtom } from 'jotai'
import { atomFamily, useAtomCallback } from 'jotai/utils'
import { useCallback } from 'react'

export type TextInputData = { name: string; defaultValue: string }
export type NumberInputData = {
  name: string
  min: number
  max: number
  step: number
  defaultValue: number
}

export type InputParams = {
  message: TextInputData
  model: TextInputData
  max_tokens: NumberInputData
  temperature: NumberInputData
  top_p: NumberInputData
  top_k: NumberInputData
  repetition_penalty: NumberInputData
}

const threadsFamily = atomFamily((params: TextInputData | NumberInputData) =>
  atom(params.defaultValue),
)

export const useThreadsAtom = (params: TextInputData | NumberInputData) =>
  useAtom(threadsFamily(params))

export const useThreadAtomCallback = (inputParams: InputParams) => {
  const readValues = useAtomCallback(
    useCallback(
      (get) => {
        const values = {
          message: get(threadsFamily(inputParams.message)) as string,
          model: get(threadsFamily(inputParams.model)) as string,
          max_tokens: get(threadsFamily(inputParams.max_tokens)) as number,
          temperature: get(threadsFamily(inputParams.temperature)) as number,
          top_p: get(threadsFamily(inputParams.top_p)) as number,
          top_k: get(threadsFamily(inputParams.top_k)) as number,
          repetition_penalty: get(threadsFamily(inputParams.repetition_penalty)) as number,
        }

        return values
      },
      [inputParams],
    ),
  )

  return readValues
}
