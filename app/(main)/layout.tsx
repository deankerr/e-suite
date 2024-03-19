import { ChatList } from '@/components/navbar/ChatList'
import { NavBar } from '@/components/navbar/NavBar'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { getAuthToken } from '@/lib/auth'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Suspense } from 'react'
import { Button } from '../components/ui/Button'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthToken()

  return (
    <div className="flex h-full overflow-hidden">
      <NavBar
        chatList={
          token ? (
            <Suspense
              fallback={
                <div className="flex-center h-full">
                  <LoaderBars />
                </div>
              }
            >
              <ChatList />
            </Suspense>
          ) : (
            <div className="flex-center h-full text-center text-gray-8">not logged in</div>
          )
        }
      >
        <UserButton />

        {!token && (
          <div className="flex justify-center gap-5">
            <SignUpButton mode="modal">
              <Button size="2">Create account</Button>
            </SignUpButton>

            <SignInButton mode="modal">
              <Button size="2">Log in</Button>
            </SignInButton>
          </div>
        )}
      </NavBar>
      {children}
    </div>
  )
}
