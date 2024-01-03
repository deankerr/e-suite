import { GenerationFeed } from './GenerationFeed'
import { LeftBar } from './LeftBar'
import { RightBar } from './RightBar'

export default function HomePage() {
  // HomePage

  return (
    <div className="grid grid-cols-[theme(spacing.72)_auto_theme(spacing.72)] overflow-hidden">
      <LeftBar />
      <GenerationFeed />
      <RightBar />
    </div>
  )
}
