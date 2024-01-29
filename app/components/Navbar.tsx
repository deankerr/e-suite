'use client'

import { cn } from '@/lib/utils'
import { Card } from '@radix-ui/themes'
import logo from '/assets/icons/logo-sunset.svg'
import Image from 'next/image'
import { useState } from 'react'
import { GenerationBar } from './GenerationBar'
import { UserButton } from './ui/UserButton'

type NavbarProps = {
  props?: any
}

export const Navbar = ({ props }: NavbarProps) => {
  // const { isLoading, isAuthenticated } = useConvexAuth()
  // const userId = useRegisterUser()

  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <>
      <Card
        className={cn('z-30 h-[7.5rem] w-20 self-start justify-self-start bg-panel-solid')}
        size="1"
      >
        <div
          className="group -m-2 grid h-16 place-content-center place-items-center"
          onClick={() => setPanelOpen(!panelOpen)}
        >
          <Image
            src={logo}
            alt="e/suite sun logo"
            className="col-start-1 row-start-1 size-11 cursor-pointer bg-transparent transition-all duration-300 group-hover:scale-105"
          />
          <div className="sun-glow col-start-1 row-start-1 size-0.5 bg-transparent blur-md" />
        </div>

        <div className="mt-2 grid place-content-center py-1">
          <UserButton />
        </div>
      </Card>

      <Card
        className={cn(
          'left-[5.5rem] z-20 self-start justify-self-start bg-panel-solid transition-all duration-1000',
          panelOpen ? '' : '-left-[100%]',
        )}
      >
        <GenerationBar show={panelOpen} />
      </Card>
    </>
  )
}
