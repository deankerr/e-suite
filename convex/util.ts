import { ConvexError, v, Validator } from 'convex/values'

export const vEnum = <const T extends ReadonlyArray<string>>(
  values: T,
): Validator<T[number], false, never> => {
  //@ts-expect-error this should be allowed
  return v.union(...values.map((e) => v.literal(e)))
}

export const raise = (message: string): never => {
  throw new Error(message)
}

export function assert<T>(
  condition: T,
  message: string,
  data?: Record<string, unknown>,
): asserts condition {
  if (!condition) throw error(message, data)
}

export const error = (message: string, data?: Record<string, unknown>) => {
  return new ConvexError({ ...data, message })
}
