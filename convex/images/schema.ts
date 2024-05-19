import { z } from 'zod'

export const imageFields = {
  originUrl: z.string(),

  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string(),
  color: z.string(),

  generationData: z.tuple([z.string(), z.string()]).array(),
}
