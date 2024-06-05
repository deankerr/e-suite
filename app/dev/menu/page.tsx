'use client'

import { CommandMenu } from '@/components/command-menu/CommandMenu'

export default function Page() {
  return (
    <div className="grid h-screen place-content-center">
      <div className="rounded border">
        <CommandMenu asDialog={false} />
      </div>
    </div>
  )
}
