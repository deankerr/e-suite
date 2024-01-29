'use client'

import { Nav } from '@/app/components/Nav'
import { Button } from '@radix-ui/themes'
import { useState } from 'react'

export default function NavPage() {
  // NavPage
  const [nav1, setNav1] = useState(false)
  return (
    <div className="h-[100vh] w-[86vw] space-y-4 place-self-center border border-accent-2">
      <div className="grid w-fit grid-flow-col gap-5">
        <Nav userOpen={nav1} />
        <Nav userOpen={nav1} />
        <Button onClick={() => setNav1(!nav1)}>nav1</Button>
      </div>
    </div>
  )
}
