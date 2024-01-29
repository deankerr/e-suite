'use client'

import { Spring1, Spring2 } from '@/app/components/Spring'
import { Slate } from '@/app/components/ui/Slate'
import { Button } from '@radix-ui/themes'
import { useState } from 'react'

export default function SpringsPage() {
  // SpringsPage
  const [act, setAct] = useState(false)

  return (
    <Slate className="z-20 h-[80%] w-[80%] place-self-center">
      <p>SpringsPage</p>
      <Button onClick={() => setAct(!act)}>act {act ? 'true' : 'false'}</Button>
      {act && <Spring1 />}
      {act && <Spring2 />}
    </Slate>
  )
}
