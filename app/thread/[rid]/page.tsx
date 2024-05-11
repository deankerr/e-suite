import { Suspense } from 'react'

import { NewThreadPage } from '@/app/thread/[rid]/NewThreadPage'

export default function Page({ params: { rid } }: { params: { rid: string } }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid h-96 w-96 place-content-center border bg-orange-3 p-4">
          thread suspense
        </div>
      }
    >
      <NewThreadPage rid={rid} />
    </Suspense>
  )
}
