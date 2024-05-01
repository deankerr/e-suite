/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { Embedding } from './embedding'
import type { TextToImageLightningInputFormat } from './textToImageLightningInputFormat'
import type { TextToImageLightningInputImageSize } from './textToImageLightningInputImageSize'
import type { TextToImageLightningInputNumInferenceSteps } from './textToImageLightningInputNumInferenceSteps'

export interface TextToImageLightningInput {
  /** The list of embeddings to use. */
  embeddings?: Embedding[]
  /** If set to true, the safety checker will be enabled. */
  enable_safety_checker?: boolean
  /** If set to true, the prompt will be expanded with additional prompts. */
  expand_prompt?: boolean
  /** The format of the generated image. */
  format?: TextToImageLightningInputFormat
  /** The size of the generated image. */
  image_size?: TextToImageLightningInputImageSize
  /**
   * The number of images to generate.
   * @minimum 1
   * @maximum 8
   */
  num_images?: number
  /** The number of inference steps to perform. */
  num_inference_steps?: TextToImageLightningInputNumInferenceSteps
  /** The prompt to use for generating the image. Be as descriptive as possible for best results. */
  prompt: string
  /** 
            The same seed and the same prompt given to the same version of Stable Diffusion
            will output the same image every time.
         */
  seed?: number
  /** 
            If set to true, the function will wait for the image to be generated and uploaded
            before returning the response. This will increase the latency of the function but
            it allows you to get the image directly in the response without going through the CDN.
         */
  sync_mode?: boolean
}
