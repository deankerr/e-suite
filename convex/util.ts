import { v } from 'convex/values'

//@ts-expect-error this should be allowed
export const vEnum = <T extends string>(values: T[]) => v.union(...values.map((e) => v.literal(e)))

export const raise = (message: string): never => {
  throw new Error(message)
}

export function invariant<T>(condition: T, message?: string): asserts condition is NonNullable<T> {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}
