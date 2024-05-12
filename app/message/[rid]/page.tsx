import { Suspense } from 'react'

// import {fetchQuery} from 'convex/nextjs'

import { MessagePage } from '@/components/pages/MessagePage'

// export async function generateMetadata({ params: { rid } }: { params: { rid: string } }) {
//   try {
//     const result = await fetchQuery(api.messages.getPageMetadata, { rid })
//     if (!result) return {}

//     return {
//       title: result.title,
//       description: result.description,
//     }
//   } catch (err) {
//     console.error(err)
//     return {}
//   }
// }

export default function Page({ params: { rid } }: { params: { rid: string } }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid h-96 w-96 place-content-center border bg-orange-3 p-4">
          message suspense
        </div>
      }
    >
      <MessagePage rid={rid} />
    </Suspense>
  )
}
