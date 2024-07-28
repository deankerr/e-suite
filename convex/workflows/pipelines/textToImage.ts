import * as vb from 'valibot'

import { fal_textToImage } from '../actions/endpoints'
import * as Ingest from '../actions/ingest'

import type { Id } from '../../_generated/dataModel'
import type { ActionCtx } from '../../_generated/server'

const Step1_Inference_Input = vb.object({
  resourceKey: vb.string(),
  prompt: vb.string(),
  n: vb.optional(vb.number()),
  size: vb.optional(vb.string()),
  width: vb.optional(vb.number()),
  height: vb.optional(vb.number()),
})

async function step1_inference(ctx: ActionCtx, input: unknown, previousResults: unknown[]) {
  try {
    console.log('step1_inference input', input)
    const vinput = vb.parse(Step1_Inference_Input, input)

    const result = await fal_textToImage(vinput)

    console.log('step1_inference output', result)
    return result
  } catch (err) {
    throw err
  }
}

const Step2_IngestImages_Input = vb.object({
  imageUrls: vb.array(vb.string()),
})

async function step2_ingestImages(ctx: ActionCtx, input: unknown, previousResults: unknown[]) {
  try {
    console.log('step2_ingestImages input', input, previousResults)
    const vinput = vb.parse(Initial_Input, input)
    const prev = previousResults.at(-1)
    const vprevinput = vb.parse(Step2_IngestImages_Input, prev)

    const result = await Ingest.images(ctx, {
      imageUrls: vprevinput.imageUrls,
      messageId: vinput.messageId as Id<'messages'>,
    })

    console.log('step2_ingestImages output', result)
    return result
  } catch (err) {
    console.error(err)
    throw err
  }
}

const Initial_Input = vb.object({
  ...Step1_Inference_Input.entries,
  messageId: vb.string(),
})

export const textToImagePipeline = {
  name: 'textToImage',
  schema: Initial_Input,
  steps: [
    {
      name: 'step1_inference',
      retryLimit: 3,
      schema: Step1_Inference_Input,
      action: step1_inference,
    },
    {
      name: 'step2_ingestImages',
      retryLimit: 3,
      schema: Step2_IngestImages_Input,
      action: step2_ingestImages,
    },
  ],
}
