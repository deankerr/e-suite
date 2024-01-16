import { v, Validator } from 'convex/values'

export const vEnum = <const T extends ReadonlyArray<string>>(
  values: T,
): Validator<T[number], false, never> => {
  //@ts-expect-error this should be allowed
  return v.union(...values.map((e) => v.literal(e)))
}

export const raise = (message: string): never => {
  throw new Error(message)
}

export function invariant<T>(condition: T, message?: string): asserts condition is NonNullable<T> {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}
