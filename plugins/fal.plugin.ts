import { ENV } from '@/lib/env'
import * as fal from '@fal-ai/serverless-client'

fal.config({
  credentials: ENV.FALAI_API_KEY,
})

export async function falTestRun() {
  const images = await fal.run('110602490-lora', {
    input: {
      model_name: 'runwayml/stable-diffusion-v1-5',
      prompt: 'a giant boar in the forest',
      negative_prompt:
        'cartoon, painting, illustration, (worst quality, low quality, normal quality:2), (epicnegative:0.9)',
    },
  })

  if (Array.isArray(images)) {
    for (const i of images) console.log(i)
  } else console.log(images)
}
