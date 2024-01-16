import { ImageModel } from '@/convex/types'
import { Separator } from '@radix-ui/themes'
import { useState } from 'react'
import { GenerationParameters } from './GenerationParameters'
import { ImageModelPicker } from './ImageModelPicker'

type GenerationControlsProps = {
  props?: any
}

export const GenerationControls = ({ props }: GenerationControlsProps) => {
  const [imageModel, setImageModel] = useState<ImageModel>()
  const [modelPickerOpen, setModelPickerOpen] = useState(false)

  return (
    <>
      <div className="my-0 hidden font-code text-[8px] text-gold-8">
        {'<GenerationControls>'} imageModel._id:{String(imageModel?._id)}
      </div>

      <ImageModelPicker
        imageModel={imageModel}
        onChange={setImageModel}
        open={modelPickerOpen}
        onOpenChange={setModelPickerOpen}
      />

      {modelPickerOpen ? null : (
        <>
          <GenerationParameters imageModel={imageModel} />
        </>
      )}
    </>
  )
}
