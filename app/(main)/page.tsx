import { CommandBar } from './CommandBar'
import { GenerationFeed } from './GenerationFeed'
import { LeftBar } from './LeftBar'
import { RightBar } from './RightBar'

export default function HomePage() {
  // HomePage

  return (
    <main className="dark:bg-grid-dark relative grid overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1">
      <GenerationFeed />
      {/* <LeftBar /> */}
      <RightBar />
      {/* <CommandBar /> */}
    </main>
  )
}
