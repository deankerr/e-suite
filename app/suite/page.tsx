import { MainContent } from '@/components/landing/main-content'
import { MainHeader } from '@/components/landing/main-header'
import { Button } from '@/components/ui/button'
import { PrePrint } from '@/components/util/pre-print'
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import Link from 'next/link'

//#   (suite) page / home page
//*   public

export default async function LandingPage() {
  // const session = await auth()
  // const kinde = getKindeServerSession()

  return (
    <>
      <MainHeader />
      <MainContent className="flex flex-col items-center justify-center space-y-4">
        <Link href="/e" className="text-center text-9xl font-semibold">
          e
        </Link>
        <Link href="/protected">Protected zone</Link>
        {/* <PrePrint title="session">{session}</PrePrint> */}
        <LoginLink>Sign in</LoginLink>
        <Button asChild>
          <Link href="/api/auth/login?">Sign in</Link>
        </Button>

        <RegisterLink>Sign up</RegisterLink>
        <LogoutLink>Log out</LogoutLink>
      </MainContent>
    </>
  )
}
