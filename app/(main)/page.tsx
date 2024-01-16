import { CommandBar } from './CommandBar'
import { GenerationFeed } from './GenerationFeed'
import { LeftBar } from './LeftBar'
import { RightBar } from './RightBar'

export default function HomePage() {
  // HomePage

  return (
    <div className="dark:bg-grid-dark relative grid overflow-hidden [&_div]:col-start-1 [&_div]:row-start-1">
      <GenerationFeed />
      {/* <LeftBar /> */}
      <RightBar />
      {/* <CommandBar /> */}
    </div>
  )
}
