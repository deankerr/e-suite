import { auth } from '@/auth'
import { MainContent } from '@/components/landing/main-content'
import { MainHeader } from '@/components/landing/main-header'
import { PrePrint } from '@/components/util/pre-print'
import Link from 'next/link'

//#   (suite) page / home page
//*   public

export default async function LandingPage() {
  const session = await auth()

  return (
    <>
      <MainHeader />
      <MainContent className="flex flex-col items-center justify-center space-y-4">
        <Link href="/e" className="text-center text-9xl font-semibold">
          e
        </Link>
        <PrePrint title="session">{session}</PrePrint>
      </MainContent>
    </>
  )
}
