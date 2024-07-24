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
        <Icons.SmileyXEyes className="size-48 text-red-10 opacity-90" />
        <h2 className="text-xl text-red-11">Error</h2>

        {error.message && (
          <pre className="max-w-[80%] overflow-x-hidden text-wrap rounded-md border border-ruby-11 bg-red-2 p-4 font-mono text-sm">
            {error.message}
          </pre>
        )}

        <Button color="red" onClick={() => reset()}>
          Reset Component
        </Button>
      </div>
    </div>
  )
}
