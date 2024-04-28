'use client'

import { MessagePageView } from '@/components/pages/MessagePageView'
import { ModalPageView } from '@/components/pages/ModalPageView'
import { Spinner } from '@/components/ui/Spinner'
import { useMessageQuery } from '@/lib/queries'

export default function MessageViewModalPage({
  params: { mrid: rid },
}: {
  params: { mrid: string }
}) {
  const result = useMessageQuery({ rid })

  return (
    <ModalPageView>
      {result ? (
        <MessagePageView content={result} />
      ) : result === null ? (
        <div>Error :(</div>
      ) : (
        <div className="absolute inset-0 grid place-content-center">
          <Spinner />
        </div>
      )}
    </ModalPageView>
  )
}
