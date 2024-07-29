import type { ActionCtx } from '../_generated/server'
import type { BaseSchema } from 'valibot'

export type PipelineStep = {
  name: string
  retryLimit: number
  action: (ctx: ActionCtx, input: unknown) => Promise<Record<string, unknown>>
}

export type Pipeline = {
  name: string
  schema: BaseSchema<any, any, any>
  steps: PipelineStep[]
}
