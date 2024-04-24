import { SignInButton, UserButton } from '@clerk/nextjs'
import { Button, Heading } from '@radix-ui/themes'
import { Unauthenticated } from 'convex/react'

type PageHeaderProps = {
  icon?: React.ReactNode
  title?: string
  children?: React.ReactNode
}

export const PageWrapper = ({ icon, title, children }: PageHeaderProps) => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl bg-gray-1 px-1 sm:px-4">
      <header className="flex h-14 items-center border-b border-gold-6">
        <div className="shrink-0 flex-start">{icon}</div>

        <Heading size="3" className="grow truncate px-2">
          {title}
        </Heading>

        <div className="shrink-0 flex-end">
          <UserButton />

          <Unauthenticated>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </header>

      {children}
    </div>
  )
}
