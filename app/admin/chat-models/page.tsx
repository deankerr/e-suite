'use client'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { ChatModelCard } from '@/components/cards/ChatModelCard'
import { useChatModels } from '@/lib/queries'

export default function Page() {
  const chatModels = useChatModels()
  const list = chatModels.data
  return (
    <AdminPageWrapper>
      <div className="flex gap-3">
        <div className="flex grow flex-wrap gap-2">
          {list?.map((model) => <ChatModelCard key={model._id} model={model} />)}
        </div>
      </div>
    </AdminPageWrapper>
  )
}
