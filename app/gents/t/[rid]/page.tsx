import { Suspense } from 'react'

import { ThreadView } from '@/app/gents/t/[rid]/ThreadView'

export default function Page({ params }: { params: { rid: string } }) {
  return (
    <Suspense fallback={<div className="bg-indigo-3">thread suspense</div>}>
      <ThreadView rid={params.rid} />
    </Suspense>
  )
}
