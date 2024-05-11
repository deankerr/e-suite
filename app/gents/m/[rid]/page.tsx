import { Suspense } from 'react'

import { MessageContentView } from '@/app/gents/m/[rid]/MessageContentView'

export default function Page({ params }: { params: { rid: string } }) {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold tracking-tighter">Message</h1>
      <Suspense fallback={<div className="h-24 w-60 bg-green-3">loading</div>}>
        <MessageContentView rid={params.rid} />
      </Suspense>
    </div>
  )
}
