import { z } from 'zod'

const Image = z.object({
  file_size: z.number(),
  height: z.number(),
  file_name: z.string(),
  content_type: z.string(),
  url: z.string(),
  width: z.number(),
})

const ImageSize = z.object({
  height: z.number().optional().default(512),
  width: z.number().optional().default(512),
})

const ImageSizeEnum = z.enum([
  'square_hd',
  'square',
  'portrait_4_3',
  'portrait_16_9',
  'landscape_4_3',
  'landscape_16_9',
])
