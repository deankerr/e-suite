import { ImageModel } from '@/convex/types'
import { useState } from 'react'
import { GenerationParams } from './GenerationParams'
import { ImageModelPicker } from './ImageModelPicker'

type GenerationControlsProps = {
  props?: any
}

export const GenerationControls = ({ props }: GenerationControlsProps) => {
  const [imageModel, setImageModel] = useState<ImageModel>()

  return (
    <>
      <div className="my-0 font-code text-[8px] text-gold-8">
        {'<GenerationControls>'} imageModel._id:{String(imageModel?._id)}
      </div>

      <ImageModelPicker imageModel={imageModel} onChange={setImageModel} />
      <GenerationParams imageModel={imageModel} />
    </>
  )
}
