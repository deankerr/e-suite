'use client'

import { useEffect } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full">
      <div className="flex-col-center mx-auto gap-4">
        <Icons.SmileyXEyes className="size-48 text-red-10 opacity-85" />
        <h2 className="text-xl text-red-11">Error</h2>

        {error.message && <p>{error.message}</p>}

        <Button color="red" onClick={() => reset()}>
          Attempt recovery
        </Button>
      </div>
    </div>
  )
}
