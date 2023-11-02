'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function WhoAmIButton({ whoAmIAction }: { whoAmIAction: () => Promise<string> }) {
  const [name, setName] = useState<string>()

  return (
    <div>
      <Button
        onClick={async () => {
          setName(await whoAmIAction())
        }}
      >
        Who Am I?
      </Button>
      {name && <div>You are {name}</div>}
    </div>
  )
}
