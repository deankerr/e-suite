import { GenerationBarDraggable } from '../components/GenerationBarDraggable'
import { GenerationFeed } from '../components/GenerationFeed'
import { GenerationForm } from '../components/section/GenerationForm'
import { Slate } from '../components/ui/Slate'

export default function HomePage() {
  // HomePage

  return (
    <>
      <GenerationFeed />
      {/* <GenerationBarDraggable />
      <Slate className="place-self-center border border-gray-7 bg-panel-solid p-4">
        Form
        <GenerationForm className="flex flex-col gap-2" />
      </Slate> */}
    </>
  )
}
