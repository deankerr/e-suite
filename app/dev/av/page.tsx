'use client'

import Av from '@/app/dev/av/av'
import { ClientOnly } from '@/components/util/ClientOnly'

export default function Page() {
  return (
    <div className="bg-gray-2 p-6">
      <ClientOnly>
        <Av />
      </ClientOnly>
    </div>
  )
}
