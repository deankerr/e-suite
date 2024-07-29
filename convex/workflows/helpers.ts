import { ConvexError } from 'convex/values'
import * as vb from 'valibot'

export class WorkflowError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly fatal: boolean = false,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'WorkflowError'
  }
}

export async function jobErrorHandling<T>(fn: () => Promise<T>, stepName: string): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof WorkflowError) {
      throw error
    } else if (error instanceof ConvexError) {
      // TODO remove ConvexErrors from jobs
      const { code, details } = error.data as { code: string; details?: any }
      throw new WorkflowError(error.message, code, true, details)
    } else if (error instanceof vb.ValiError) {
      throw new WorkflowError(error.message, 'validation_error', true, vb.flatten(error.issues))
    } else {
      console.error(`Error in step ${stepName}:`, error)
      throw new WorkflowError(`Unexpected error in step ${stepName}`, 'unexpected_error', false, {
        originalError: error,
      })
    }
  }
}
