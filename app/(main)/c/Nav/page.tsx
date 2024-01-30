'use client'

import { Nav } from '@/app/components/Nav'
import { Slate } from '@/app/components/ui/Slate'
import sunLogoSvg from '/assets/icons/logo-sunset.svg'
import NextImage from 'next/image'

export default function NavPage() {
  // NavPage

  return (
    <div className="h-[100vh] w-[86vw] space-y-4 place-self-center border border-accent-2">
      <div className="grid w-fit grid-flow-col gap-5 px-12">
        <Nav />
      </div>
      <Slate className="h-96 w-96 place-content-center p-16">
        <button className=" after:sun-glow2 size-16 cursor-pointer p-2 after:rounded-full">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <NextImage src={sunLogoSvg} alt="e/suite sun logo" className="" />
        </button>
      </Slate>
    </div>
  )
}
