import type { Id } from '../_generated/dataModel'
import type { ActionCtx } from '../_generated/server'

// * Base types for all workflows
type WorkflowStepBase = {
  name: string
  retryLimit: number
}

type JobBase = {
  workflowType: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  currentStep: number
  stepResults: StepResult[]
  updatedAt: number
}

type StepResult = {
  stepName: string
  status: 'completed' | 'failed'
  result?: any
  error?: string
  startTime: number
  endTime: number
  retryCount: number
}

// * TextToImage Workflow
type TextToImageInput = {
  messageId: Id<'messages'>
  type: 'textToImage'
  resourceKey: string
  prompt: string
  n: number
  size?: 'portrait' | 'square' | 'landscape'
  width?: number
  height?: number
}

type TextToImageOutput1 = {
  imageUrls: string[]
}

type TextToImageOutput2 = {
  imageIds: string[]
}

type TextToImageOutput = TextToImageOutput1 | TextToImageOutput2

type TextToImageStep = WorkflowStepBase & {
  action: (
    ctx: ActionCtx,
    input: TextToImageInput,
    previousResults: any[],
  ) => Promise<TextToImageOutput>
}

type TextToImageWorkflow = {
  type: 'textToImage'
  steps: TextToImageStep[]
}

type TextToImageJob = JobBase & {
  workflowType: 'textToImage'
  input: TextToImageInput
  output?: TextToImageOutput
}

// Union types for all workflows
type WorkflowType = TextToImageWorkflow
type Job = TextToImageJob
type WorkflowInput = TextToImageInput
type WorkflowOutput = TextToImageOutput

export type { WorkflowType, Job, WorkflowInput, WorkflowOutput, TextToImageWorkflow }
