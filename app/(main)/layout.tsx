import { NavBar } from '@/components/NavBar'
import { auth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from '../components/ui/Button'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout
  const { userId } = auth()

  return (
    <div className="flex h-full overflow-hidden">
      <NavBar>
        <UserButton />

        {!userId && (
          <div className="flex flex-col justify-center gap-5">
            <SignUpButton mode="modal">
              <Button size="3">Create account</Button>
            </SignUpButton>

            <SignInButton mode="modal">
              <Button size="3">Log in</Button>
            </SignInButton>
          </div>
        )}
      </NavBar>
      {children}
    </div>
  )
}
