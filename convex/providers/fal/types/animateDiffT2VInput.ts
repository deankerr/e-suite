/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { AnimateDiffT2VInputMotionsItem } from './animateDiffT2VInputMotionsItem'
import type { AnimateDiffT2VInputVideoSize } from './animateDiffT2VInputVideoSize'

export interface AnimateDiffT2VInput {
  /**
   * Number of frames per second to extract from the video.
   * @minimum 1
   * @maximum 16
   */
  fps?: number
  /**
   * 
            The CFG (Classifier Free Guidance) scale is a measure of how close you want
            the model to stick to your prompt when looking for a related image to show you.
        
   * @minimum 0
   * @maximum 20
   */
  guidance_scale?: number
  /** The motions to apply to the video. */
  motions?: AnimateDiffT2VInputMotionsItem[]
  /** 
            The negative prompt to use. Use it to address details that you don't want
            in the image. This could be colors, objects, scenery and even the small details
            (e.g. moustache, blurry, low resolution).
         */
  negative_prompt?: string
  /**
   * The number of frames to generate for the video.
   * @minimum 1
   * @maximum 32
   */
  num_frames?: number
  /**
   * The number of inference steps to perform.
   * @minimum 1
   * @maximum 50
   */
  num_inference_steps?: number
  /** The prompt to use for generating the video. Be as descriptive as possible for best results. */
  prompt: string
  /** 
            The same seed and the same prompt given to the same version of Stable Diffusion
            will output the same image every time.
         */
  seed?: number
  /** The size of the video to generate. */
  video_size?: AnimateDiffT2VInputVideoSize
}