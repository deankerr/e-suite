import { SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { IconButton } from '@radix-ui/themes'
import { UserIcon } from 'lucide-react'

type UserSegmentProps = { props?: unknown }

export const UserSegment = ({}: UserSegmentProps) => {
  return (
    <div className="flex-none gap-2 flex-end">
      <SignedOut>
        <SignInButton mode="modal">
          <IconButton variant="surface" radius="large">
            <UserIcon />
          </IconButton>
        </SignInButton>
      </SignedOut>
      <UserButton />
    </div>
  )
}
