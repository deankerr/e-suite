import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button, Heading } from '@radix-ui/themes'
import { HomeIcon } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'

import SunLarge from '@/assets/sun-large.svg'

type PageHeaderProps = {
  icon?: React.ReactNode
  title?: string
  topBar?: React.ReactNode
  children?: React.ReactNode
}

export const PageWrapper = ({ icon, title, topBar, children }: PageHeaderProps) => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-8xl bg-gray-1 px-1 sm:px-4">
      <div className="fixed inset-0 flex bg-gradient-radial from-orange-2 to-[84%] p-12">
        <NextImage
          className="m-auto opacity-10"
          unoptimized
          alt=""
          src={SunLarge}
          width={500}
          height={500}
        />
      </div>
      <header className="flex h-14 items-center border-b border-gold-6 px-1">
        <div className="shrink-0 flex-start">{icon}</div>

        <Heading size="3" className="grow truncate px-2">
          {title}
        </Heading>

        <div className="shrink-0 gap-2 px-2 flex-between">{topBar}</div>

        <div className="shrink-0 px-2">
          <SignedIn>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <HomeIcon />
              </Link>
            </Button>
          </SignedIn>
        </div>

        <div className="shrink-0 flex-end">
          <UserButton />

          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      {children}
    </div>
  )
}
