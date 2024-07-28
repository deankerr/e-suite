import { omit } from 'convex-helpers'
import { partial } from 'convex-helpers/validators'
import { v } from 'convex/values'
import * as vb from 'valibot'

import { internal } from '../_generated/api'
import { internalAction, internalMutation, internalQuery } from '../functions'
import { job3Fields, runConfigTextToImageV } from '../schema'
import { getErrorMessage } from '../shared/utils'
import { textToImagePipeline } from './pipelines/textToImage'

const pipelines = {
  textToImage: textToImagePipeline,
}

export const startJob = internalMutation({
  args: {
    pipeline: v.string(),
    input: v.any(),
  },
  handler: async (ctx, args) => {
    const pipeline = pipelines[args.pipeline as keyof typeof pipelines]
    if (!pipeline) {
      throw new Error(`Unknown pipeline: ${args.pipeline}`)
    }

    const jobId = await ctx.table('jobs3').insert({
      pipeline: args.pipeline,
      status: 'pending',
      currentStep: 0,
      input: vb.parse(pipeline.schema, args.input),
      stepResults: [],
      updatedAt: Date.now(),
    })

    await ctx.scheduler.runAfter(0, internal.workflows.engine2.executeStep, { jobId })
    console.log('job created', args.pipeline, jobId)
    return jobId
  },
})

export const executeStep = internalAction({
  args: {
    jobId: v.id('jobs3'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.runQuery(internal.workflows.engine2.getJob, { jobId })
    if (!job) {
      throw new Error('job not found')
    }

    const pipeline = pipelines[job.pipeline as keyof typeof pipelines]
    const step = pipeline.steps[job.currentStep]
    // * no step - assume job finished
    if (!step) {
      await ctx.runMutation(internal.workflows.engine2.updateJobStatus, {
        jobId,
        status: 'completed',
      })
      return
    }

    const stepStartTime = Date.now()
    try {
      // * run step
      const previousResults = job.stepResults.map((r) => r.result)
      const stepInput = job.input
      const result = await step.action(ctx, stepInput, previousResults)

      console.log('engine step result', result)

      // * add successful result
      await ctx.runMutation(internal.workflows.engine2.addStepResult, {
        jobId,
        stepResult: {
          stepName: step.name,
          status: 'completed',
          result,
          startTime: stepStartTime,
          endTime: Date.now(),
          retryCount: 0,
        },
      })

      // * schedule next step, return
      await ctx.scheduler.runAfter(0, internal.workflows.engine2.executeStep, { jobId })
    } catch (err) {
      const retryCount = (job.stepResults.at(-1)?.retryCount ?? 0) + 1

      if (retryCount > step.retryLimit) {
        // * max retries reached, fail
        await ctx.runMutation(internal.workflows.engine2.updateJobStatus, {
          jobId,
          status: 'failed',
        })
      } else {
        // * add failed step error, retry
        await ctx.runMutation(internal.workflows.engine2.addStepResult, {
          jobId,
          stepResult: {
            stepName: step.name,
            status: 'failed',
            error: {
              code: 'job_error',
              message: getErrorMessage(err),
              fatal: false,
            },
            result: null,
            startTime: stepStartTime,
            endTime: Date.now(),
            retryCount,
          },
        })

        // * Retry after a delay
        await ctx.scheduler.runAfter(5000, internal.workflows.engine2.executeStep, { jobId })
      }
    }
  },
})

export const getJob = internalQuery({
  args: {
    jobId: v.id('jobs3'),
  },
  handler: async (ctx, args) => {
    return await ctx.table('jobs3').get(args.jobId)
  },
})

export const updateJobStatus = internalMutation({
  args: {
    jobId: v.id('jobs3'),
    status: job3Fields.status,
  },
  handler: async (ctx, { jobId, status }) => {
    const job = await ctx.table('jobs3').getX(jobId)
    return await job.patch({
      status,
    })
  },
})

export const addStepResult = internalMutation({
  args: {
    jobId: v.id('jobs3'),
    stepResult: job3Fields.stepResults.element,
  },

  handler: async (ctx, { jobId, stepResult }) => {
    const job = await ctx.table('jobs3').getX(jobId)
    console.log('add step result', stepResult)
    try {
      return await job.patch({
        status: 'active',
        stepResults: [...job.stepResults, stepResult],
        currentStep: stepResult.status === 'completed' ? job.currentStep + 1 : job.currentStep,
        updatedAt: Date.now(),
      })
    } catch (err) {
      console.log(stepResult)
      throw err
    }
  },
})

export const spawnTextToImageJob = internalAction({
  args: {
    input: v.optional(v.object(partial(omit(runConfigTextToImageV.fields, ['type'])))),
  },
  handler: async (ctx, args): Promise<string> => {
    const jobId = await ctx.runMutation(internal.workflows.engine2.startJob, {
      pipeline: 'textToImage',
      input: {
        messageId: 'jh78wrc3ebj62mrj54waegp42h6xsewt',
        resourceKey: 'fal::fal-ai/pixart-sigma',
        prompt: 'A beautiful landscape',
        n: 2,
        width: 1024,
        height: 1024,

        ...args.input,
      },
    })

    return jobId as string
  },
})
