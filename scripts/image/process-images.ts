import { readdir } from 'node:fs/promises'

import { processImage, SharpProcessOptions } from '@/convex/lib/process'

async function processImageFile(path: string, options: SharpProcessOptions) {
  const file = Bun.file(path)
  const result = await processImage(file, options)
  return result
}

const inputDir = 'scripts/image/files/input/'
const outputDir = 'scripts/image/files/'

async function processDir(opts?: any) {
  const dir = await readdir(inputDir, { recursive: true })
  const files = dir.filter((f) => f.startsWith('input') && !f.includes('-'))

  for (const file of files) {
    console.log(file)
    const result = await processImageFile(inputDir + file, opts)

    // const webpFile = Bun.file(fileDir + `${file.replace('.png', '-opt.webp')}`)
    // await Bun.write(webpFile, result.webp)

    // const optsToName = opts ? Object.entries(opts.blur)
    //   .map((opt) => opt.join('-'))
    //   .join('-') :

    const blurFile = Bun.file(outputDir + `${file.replace('.png', `-blur.png`)}`)
    await Bun.write(blurFile, result.blurBlob)
  }
}

processDir()
// for (const opt of optionList) processDir(opt)
