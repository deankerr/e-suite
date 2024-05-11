'use client'

// import { MessagePage } from '@/components/pages/MessagePage'
import { ModalPage } from '@/components/pages/ModalPage'
import { Spinner } from '@/components/ui/Spinner'
import { useMessageQuery } from '@/lib/queries'

export default function Page({ params: { mrid: rid } }: { params: { mrid: string } }) {
  const result = useMessageQuery({ rid })

  return (
    <ModalPage>
      {result ? (
        '<MessagePage content={result} />'
      ) : result === null ? (
        <div>Error :(</div>
      ) : (
        <div className="absolute inset-0 grid place-content-center">
          <Spinner />
        </div>
      )}
    </ModalPage>
  )
}
