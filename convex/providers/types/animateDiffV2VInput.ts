/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { AnimateDiffV2VInputMotionsItem } from './animateDiffV2VInputMotionsItem'

export interface AnimateDiffV2VInput {
  /**
   * The first N number of seconds of video to animate.
   * @minimum 2
   * @maximum 4
   */
  first_n_seconds?: number
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
  motions?: AnimateDiffV2VInputMotionsItem[]
  /** 
            The negative prompt to use. Use it to address details that you don't want
            in the image. This could be colors, objects, scenery and even the small details
            (e.g. moustache, blurry, low resolution).
         */
  negative_prompt?: string
  /**
   * The number of inference steps to perform.
   * @minimum 1
   * @maximum 50
   */
  num_inference_steps?: number
  /** The prompt to use for generating the image. Be as descriptive as possible for best results. */
  prompt: string
  /** 
            The same seed and the same prompt given to the same version of Stable Diffusion
            will output the same image every time.
         */
  seed?: number
  /**
   * The strength of the input video in the final output.
   * @minimum 0.1
   * @maximum 1
   */
  strength?: number
  /** URL of the video. */
  video_url: string
}
