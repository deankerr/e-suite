import { fetchQuery } from 'convex/nextjs'

import { MessagePage } from '@/components/pages/MessagePage'
import { api } from '@/convex/_generated/api'

export async function generateMetadata({ params: { mrid: rid } }: { params: { mrid: string } }) {
  try {
    const result = await fetchQuery(api.messages.getPageMetadata, { rid })
    if (!result) return {}

    return {
      title: result.title,
      description: result.description,
    }
  } catch (err) {
    console.error(err)
    return {}
  }
}

export default function Page({ params: { mrid: rid } }: { params: { mrid: string } }) {
  return <MessagePage rid={rid} />
}
