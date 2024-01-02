import { Avatar, Box, Card, Flex, Select, Text } from '@radix-ui/themes'
import { GenerationFeed } from './GenerationFeed'
import { LeftBar } from './LeftBar'
import { RightBar } from './RightBar'

export default function HomePage() {
  // HomePage

  return (
    <div className="grid grid-cols-[theme(spacing.72)_auto_theme(spacing.72)]">
      <LeftBar />

      {/* main feed */}
      <GenerationFeed />

      <RightBar />
    </div>
  )
}
