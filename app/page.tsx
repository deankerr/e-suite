'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { Authenticated } from 'convex/react'

import { UserButtons } from '@/components/layout/UserButtons'
import { useShellActions } from '@/components/shell/hooks'
import { LogoSvg } from '@/components/ui/LogoSvg'

export default function Page() {
  const shell = useShellActions()

  return (
    <div className="flex-col-between h-full p-3">
      <div className="h-6 w-full">
        <Authenticated>
          <IconButton variant="ghost" onClick={() => shell.open()}>
            <Icons.Terminal />
          </IconButton>
        </Authenticated>
      </div>

      <LogoSvg className="m-auto w-48 text-gray-2" />

      <div className="h-6">
        <UserButtons />
      </div>
    </div>
  )
}
