import { Suspense } from 'react'

import { ThreadPage } from '@/components/pages/ThreadPage'

export default function Page({ params: { rid } }: { params: { rid: string } }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid h-96 w-96 place-content-center border bg-orange-3 p-4">
          thread suspense
        </div>
      }
    >
      <ThreadPage rid={rid} />
    </Suspense>
  )
}
