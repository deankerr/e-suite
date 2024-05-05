'use client'

import { Suspense } from 'react'

import { CmdBarDev } from '@/app/dev/basic/ErrorBoundary'
import { CmbDebug } from '@/components/command-bar/CmbDebug'
import { PageHeader } from '@/components/pages/PageHeader'

export default function Page() {
  return (
    <>
      <Suspense
        fallback={
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-red-3 p-4">cmdbar suspense</div>
          </div>
        }
      >
        <CmdBarDev />
      </Suspense>
      <PageHeader title="Basic Page" />
      <CmbDebug />
    </>
  )
}
