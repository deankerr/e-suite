'use client'

import { CommandMenu } from '@/components/command/CommandMenu'
import { PageHeader } from '@/components/pages/PageHeader'

export default function Page() {
  return (
    <>
      <PageHeader title="Basic Page" />
      <div className="fixed inset-x-0 bottom-80">
        <CommandMenu />
      </div>
    </>
  )
}
