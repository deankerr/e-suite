'use client'

import { Button } from '@/app/components/ui/Button'
import { Card, Text } from '@radix-ui/themes'
import { useEffect } from 'react'

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
    <div className="flex w-full items-center justify-center">
      <Card size="4">
        <div className="flex flex-col gap-4">
          <h5>Oopsies! Something went wrong!</h5>
          <Text>{"Make sure that you're logged in first."}</Text>
          <Button className="flex" onClick={() => reset()}>
            Try again?
          </Button>
        </div>
      </Card>
    </div>
  )
}
