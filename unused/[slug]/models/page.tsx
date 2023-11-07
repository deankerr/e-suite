import { EngineBrowser } from '@/components/chat/engine-browser'
import { authServerProtected, getEngines } from '@/lib/db'

export default async function ModelsPage({ params }: { params: { slug: string } }) {
  const { chatTab } = await authServerProtected({ chatTabSlug: params.slug })
  const engines = await getEngines()

  return (
    <div className="space-y-2 p-6">
      <EngineBrowser engines={engines} chatTab={chatTab} />
    </div>
  )
}
