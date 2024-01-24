import { GenerationResult } from '@/convex/types'
import { Button } from '@radix-ui/themes'
import { FileImageIcon } from 'lucide-react'
import { Shell } from '../ui/Shell'

export const Generation = ({ author, generation, images, imageModel }: GenerationResult) => {
  return (
    <Shell.Root>
      <Shell.TitleBar icon={FileImageIcon}>{generation.prompt}</Shell.TitleBar>
      
      <Shell.Controls>
        <Button variant="outline">Link</Button>
        <Button variant="outline">Copy</Button>
        <Button variant="outline" color="red">
          Delete
        </Button>
      </Shell.Controls>

      <Shell.Content>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(min(100%,_384px),_1fr))]">

        </div>
      </Shell.Content>
    </Shell.Root>
  )
}

const createImageFrames = (images: GenerationResult['images'], size: number) => {

}