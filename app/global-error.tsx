'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html>
      <body className="flex h-full p-4">
        <div className="flex-col-center m-auto gap-3">
          <h2>Something went globally wrong!</h2>
          <button className="border p-1" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
