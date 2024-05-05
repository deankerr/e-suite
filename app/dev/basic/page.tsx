'use client'

import { CmdBarDev } from '@/app/dev/basic/ErrorBoundary'
import { CmbDebug } from '@/components/command-bar/CmbDebug'
import { PageHeader } from '@/components/pages/PageHeader'

export default function Page() {
  return (
    <>
      <CmdBarDev />
      <PageHeader title="Basic Page" />
      <CmbDebug />
    </>
  )
}
