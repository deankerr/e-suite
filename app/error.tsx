'use client'

import { useEffect } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'

import { Scanlines } from '@/components/effects/Scanlines'

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
    <div className="flex-col-center h-dvh gap-4 overflow-hidden p-4">
      <Scanlines className="animate-scanlinesDown pointer-events-none absolute bottom-0 h-[110%] w-full text-ruby-6 opacity-60" />

      <Icons.SmileyXEyes className="-m-4 size-48 shrink-0 text-red-10 opacity-60" />

      <h2 className="font-mono text-xl text-red-10">error</h2>

      <div className="w-full max-w-2xl overflow-y-auto overflow-x-hidden text-wrap rounded-md border border-red-11 bg-red-2 p-4 font-mono text-sm">
        {error?.message}
      </div>

      <Button color="red" variant="solid" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  )
}
