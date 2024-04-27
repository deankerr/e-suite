import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button, Heading } from '@radix-ui/themes'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'

type PageHeaderProps = {
  icon?: React.ReactNode
  title?: string
  children?: React.ReactNode
}

export const PageWrapper = ({ icon, title, children }: PageHeaderProps) => {
  return (
    <div className="max-w-8xl mx-auto min-h-screen w-full bg-gray-1 px-1 sm:px-4">
      <header className="flex h-14 items-center border-b border-gold-6">
        <div className="shrink-0 flex-start">{icon}</div>

        <Heading size="3" className="grow truncate px-2">
          {title}
        </Heading>

        <div className="px-2">
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
