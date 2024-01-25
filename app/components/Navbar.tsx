'use client'

import { Id } from '@/convex/_generated/dataModel'
import { Button, Card, TextArea } from '@radix-ui/themes'
import logo from '/assets/icons/logo-sunset.svg'
import { useConvexAuth } from 'convex/react'
import Image from 'next/image'
import { ImageModelCard } from './ImageModelCard'
import { DimensionsToggleGroup } from './ui/DimensionsToggleGroup'
import { useRegisterUser } from './useRegisterUser'

type NavbarProps = {
  props?: any
}

export const Navbar = ({ props }: NavbarProps) => {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const userId = useRegisterUser()

  return (
    <Card
      className="z-30 self-start justify-self-center bg-panel-solid opacity-100 hover:opacity-100"
      size="1"
    >
      <div className="flex gap-2.5">
        <div className="grid h-rx-9 place-content-center">
          <Image src={logo} alt="e/suite sun logo" className="size-9" />
        </div>

        <div className="grid max-w-2xl gap-2 md:grid-cols-2">
          <TextArea placeholder="what do you want to see?" className="" />
          <TextArea placeholder="what do you not want to see?" className="" />

          <ImageModelCard
            id={'k574mz0xgj33gmb0ms469jwrpn6hf2zz' as Id<'imageModels'>}
            className=""
          />
          <div className="flex flex-col justify-between gap-2">
            <DimensionsToggleGroup />
            {/* <Separator size="4" /> */}
            <Button variant="surface">Generate</Button>
          </div>
        </div>
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
