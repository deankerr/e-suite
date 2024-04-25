'use client'

import { useMessageQuery } from '@/app/queries'
import { MessagePageView } from '@/components/pages/MessagePageView'
import { ModalPageView } from '@/components/pages/ModalPageView'

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
        <div>
          <span className="ds-loading bg-orange-9"></span>
        </div>
      )}
    </ModalPageView>
  )
}
