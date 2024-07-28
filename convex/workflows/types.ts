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

// * TextToAudio workflow
type TextToAudioInput = {
  endpoint: string
  modelId: string
  prompt: string
  duration: number
  quantity: number
}

type TextToAudioOutput = {
  imageUrls: string[]
  captions: string[]
  nsfwRatings: number[]
}

type TextToAudioStep = WorkflowStepBase & {
  action: (ctx: ActionCtx, input: any, previousResults: any[]) => Promise<any>
}

type TextToAudioWorkflow = {
  type: 'textToAudio'
  steps: TextToAudioStep[]
}

type TextToAudioJob = JobBase & {
  workflowType: 'textToImage'
  input: TextToAudioInput
  output?: TextToAudioOutput
}

// * Chat Workflow (provisional)
type ChatInput = {
  messages: { role: 'user' | 'assistant'; content: string }[]
  model: string
  temperature: number
}

type ChatOutput = {
  response: string
  tokens: number
}

type ChatStep = WorkflowStepBase & {
  action: (ctx: ActionCtx, input: any, previousResults: any[]) => Promise<any>
}

type ChatWorkflow = {
  type: 'chat'
  steps: ChatStep[]
}

type ChatJob = JobBase & {
  workflowType: 'chat'
  input: ChatInput
  output?: ChatOutput
}

// Union types for all workflows
type WorkflowType = TextToImageWorkflow | TextToAudioWorkflow | ChatWorkflow
type Job = TextToImageJob | TextToAudioJob | ChatJob
type WorkflowInput = TextToImageInput | TextToAudioInput | ChatInput
type WorkflowOutput = TextToImageOutput | TextToAudioOutput | ChatOutput

export type {
  WorkflowType,
  Job,
  WorkflowInput,
  WorkflowOutput,
  TextToImageWorkflow,
  TextToAudioWorkflow,
  ChatWorkflow,
}
