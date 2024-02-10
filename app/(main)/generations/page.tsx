'use client'

import { GenerateDrawer } from '../../components/generations/GenerateDrawer'
import { GenerationFeed } from '../../components/generations/GenerationFeed'

export default function HomePage() {
  // HomePage

  return (
    <div className="grow">
      <GenerationFeed />
      <GenerateDrawer />
    </div>
  )
}
