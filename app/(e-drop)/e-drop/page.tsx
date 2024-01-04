import { CommandBar } from './CommandBar'
import { GenerationFeed } from './GenerationFeed'
import { LeftBar } from './LeftBar'
import { RightBar } from './RightBar'

export default function HomePage() {
  // HomePage

  return (
    <div className="dark:bg-grid-dark flex justify-center overflow-hidden">
      {/* <LeftBar /> */}
      <GenerationFeed />
      <RightBar />
      <CommandBar />
    </div>
  )
}
