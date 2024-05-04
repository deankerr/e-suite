import { useCallback } from 'react'
import { atom, useAtom } from 'jotai'
import { atomFamily, useAtomCallback } from 'jotai/utils'

import { Id } from '@/convex/_generated/dataModel'

export const threadIdAtom = atom<Id<'threads'>>('n97bc500cszh8m2w8rny0aky716qtrhe' as Id<'threads'>)
export const modelSelectedAtom = atom('sinkin:4zdwGOB')
export const useSelectedModel = () => {
  const [value, set] = useAtom(modelSelectedAtom)
  const [provider, model] = value.split(':')
  return {
    resId: value,
    provider,
    model,
    set,
  }
}

type FormInputValue = { name: string; value: string | string[] | number | boolean }
export const formInputAtomFamily = atomFamily(
  (input: FormInputValue) => atom(input),
  (a, b) => a.name === b.name,
)

export const useFormAtom = <T extends FormInputValue['value']>(name: string, value: T) => {
  const [input, setInput] = useAtom(formInputAtomFamily({ name, value }))
  return {
    set: (value: T) => setInput({ name, value }),
    value: input.value as T,
  }
}

export const useReadForm = (keys: string[]) => {
  const readForm = useAtomCallback(
    useCallback(
      (get) => {
        const values = keys.map((key) => {
          const input = get(formInputAtomFamily({ name: key, value: '' }))
          return input
        })

        return values
      },
      [keys],
    ),
  )

  return readForm
}
