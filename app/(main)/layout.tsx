import { NavigationSidebar } from '@/components/navigation/NavigationSidebar'
import { ZData } from '@/components/ZData'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // const token = await getAuthToken()

  return (
    <div className="flex h-full overflow-hidden">
      <ZData />
      <NavigationSidebar />
      {children}

      {/* <NavBar
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
            <div className="@2xs:flex-center hidden h-full grow text-center text-gray-8">
              not logged in
            </div>
          )
        }
      >
        <UserButton />

        {!token && (
          <div className="hidden justify-center gap-5 @2xs:flex">
            <SignUpButton mode="modal">
              <Button size="2">Create account</Button>
            </SignUpButton>

            <SignInButton mode="modal">
              <Button size="2">Log in</Button>
            </SignInButton>
          </div>
        )}
      </NavBar> */}
    </div>
  )
}
