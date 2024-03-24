import { NavigationSidebar } from '@/components/navigation/NavigationSidebar'
import { getAuthToken } from '@/lib/auth'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from '../../components/ui/Button'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthToken()

  return (
    <div className="flex h-full overflow-hidden">
      <NavigationSidebar>
        <UserButton />

        {!token && (
          <div className="flex-center grow gap-5">
            <SignUpButton mode="modal">
              <Button size="2">Create account</Button>
            </SignUpButton>

            <SignInButton mode="modal">
              <Button size="2">Log in</Button>
            </SignInButton>
          </div>
        )}
      </NavigationSidebar>
      {children}
    </div>
  )
}
