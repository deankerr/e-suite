'use client'

import { Button } from '@radix-ui/themes'
import { ErrorBoundary } from 'react-error-boundary'

import type { FallbackProps } from 'react-error-boundary'

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert" className="gap-2 bg-gray-2 flex-col-center">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <Button color="indigo" onClick={() => resetErrorBoundary()}>
        reset?
      </Button>
    </div>
  )
}

export const ErrBoundary = ({ children }: { children?: React.ReactNode }) => (
  <ErrorBoundary
    FallbackComponent={Fallback}
    onReset={(details) => {
      // Reset the state of your app so the error doesn't happen again
      console.warn(details)
    }}
  >
    {children}
  </ErrorBoundary>
)
