import { auth } from '@/auth'
import { Suite } from '@/components/suite/suite'

//#   (suite)/e/page Main - workbench
//&   protected

export default async function MainPage({ params }: { params: { e: string } }) {
  const session = await auth()

  if (!session) return null

  return <Suite session={session} />
}
