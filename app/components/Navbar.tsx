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
  const { isLoading, isAuthenticated } = useConvexAuth()
  const userId = useRegisterUser()

  const [show, setShow] = useState<boolean | 'indeterminate'>(false)

  return (
    <Card
      className={cn(
        'z-30 self-start justify-self-center bg-panel-solid opacity-100 hover:opacity-100',
        !show && 'justify-self-start',
      )}
      size="1"
    >
      <Checkbox
        className="absolute inset-1 z-50"
        value={String(show)}
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
