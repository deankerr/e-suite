import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { IconButton } from '@radix-ui/themes'
import { UserIcon } from 'lucide-react'

export const UserButtons = () => {
  return (
    <div className="w-7 flex-none gap-2 flex-end">
      <SignedOut>
        <SignInButton mode="modal">
          <IconButton variant="surface" radius="large">
            <UserIcon />
          </IconButton>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}
