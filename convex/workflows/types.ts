import type { ActionCtx } from '../_generated/server'

export type PipelineStep = {
  name: string
  retryLimit: number
  action: (ctx: ActionCtx, input: unknown) => Promise<Record<string, unknown>>
}

export type Pipeline = {
  name: string
  steps: PipelineStep[]
}
