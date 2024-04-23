'use client'

import { useMessageQuery } from '@/app/queries'
import { MessagePageView } from '@/components/pages/MessagePageView'
import { ModalPageView } from '@/components/pages/ModalPageView'

export default function MessageViewModalPage({
  params: { mSlugId: slugId },
}: {
  params: { mSlugId: string }
}) {
  const result = useMessageQuery({ slugId })

  return (
    <ModalPageView>
      {result ? (
        <MessagePageView {...result} />
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
