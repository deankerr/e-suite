import { EngineBrowser } from '@/components/chat/engine-browser'
import { authServerProtected, getEngines } from '@/lib/db'

/* 
  # [slug] layout
  & protected
  TODO deprecated
*/

export default async function TabIndexPage({ params }: { params: { slug: string } }) {
  const { chatTab } = await authServerProtected({ chatTabSlug: params.slug })
  const engines = await getEngines()

  return (
    <>
      TabIndexPage
      <div className="space-y-2 p-6">
        <EngineBrowser engines={engines} chatTab={chatTab} />
      </div>
    </>
  )
}

/* <pre className="overflow-x-auto">{JSON.stringify(session, null, 2)}</pre> */
