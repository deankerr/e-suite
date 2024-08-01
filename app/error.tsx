'use client'

import { ErrorPage } from '@/components/pages/ErrorPage'

export default function Error(props: any) {
  return (
    <div className="h-dvh">
      <ErrorPage {...props} />
    </div>
  )
}
