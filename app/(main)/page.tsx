'use client'

import { Button, Card } from '@radix-ui/themes'
import { GenerateDrawer } from '../components/card/GenerateDrawer'
import { GenerationPageMenu } from '../components/card/GenerationPageMenu'
import { GenerationFeed } from '../components/GenerationFeed'

export default function HomePage() {
  // HomePage

  return (
    <>
      <GenerationFeed className="" />
      {/* <GenerationPageMenu /> */}
      <GenerateDrawer />
      {/* <GenerationBarDraggable /> */}
    </>
  )
}
