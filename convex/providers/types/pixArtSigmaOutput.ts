/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { Image } from './image'
import type { PixArtSigmaOutputTimings } from './pixArtSigmaOutputTimings'

export interface PixArtSigmaOutput {
  /** Whether the generated images contain NSFW concepts. */
  has_nsfw_concepts: boolean[]
  /** The generated image files info. */
  images: Image[]
  /** The prompt used for generating the image. */
  prompt: string
  /** 
            Seed of the generated Image. It will be the same value of the one passed in the
            input or the randomly generated that was used in case none was passed.
         */
  seed: number
  /** The timings of the different steps of the generation process. */
  timings: PixArtSigmaOutputTimings
}
