'use client'

import { cn } from '@/lib/utils'
import { Card, Checkbox } from '@radix-ui/themes'
import logo from '/assets/icons/logo-sunset.svg'
import { useConvexAuth } from 'convex/react'
import Image from 'next/image'
import { useState } from 'react'
import { GenerationBar } from './GenerationBar'
import { UserButton } from './ui/UserButton'
import { useRegisterUser } from './useRegisterUser'

type NavbarProps = {
  props?: any
}

export const Navbar = ({ props }: NavbarProps) => {
  // const { isLoading, isAuthenticated } = useConvexAuth()
  // const userId = useRegisterUser()

  const [show, setShow] = useState<boolean | 'indeterminate'>(true)

  return (
    <Card
      className={cn(
        'z-30 self-start justify-self-start bg-panel-solid opacity-60 hover:opacity-100',
      )}
      size="1"
    >
      <Checkbox
        className="absolute inset-1 z-50"
        checked={show}
        onCheckedChange={(v) => setShow(v)}
      />
      <div className="flex gap-2.5">
        <div className="grid gap-2">
          <Image src={logo} alt="e/suite sun logo" className="size-9" />
          <UserButton />
        </div>

        <GenerationBar show={Boolean(show)} />
      </div>
    </Card>
  )
}

{
  /* {!isLoading && !isAuthenticated && <SignInButton mode="modal" />} */
}
{
  /* <UserButton afterSignOutUrl="/" /> */
}
