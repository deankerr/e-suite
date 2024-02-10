'use client'

import { GenerateDrawer } from '../../components/card/GenerateDrawer'
import { GenerationFeed } from '../../components/page/GenerationFeed'

export default function HomePage() {
  // HomePage

  return (
    <div className="grow">
      <GenerationFeed />
      <GenerateDrawer />
    </div>
  )
}
