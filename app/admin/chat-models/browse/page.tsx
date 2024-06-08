/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { Card } from '@radix-ui/themes'
import { useQuery } from 'convex-helpers/react'
import fuzzysort from 'fuzzysort'
import { useSet, useTitle } from 'react-use'

import { ChatModelForm } from '@/app/admin/chat-models/browse/ChatModelForm'
import { ChatModelsDataTable } from '@/app/admin/chat-models/ChatModelsDataTable'
import { api } from '@/convex/_generated/api'

export default function Page() {
  useTitle('admin - chat models - browse')
  const models = useQuery(api.db.chatModels.list, {})

  const [searchValue, setSearchValue] = useState('')

  const result = fuzzysort.go(searchValue, models.data ?? [], {
    keys: ['slug', 'name', 'creatorName'],
    all: true,
    threshold: 0.5,
    limit: 16,
  })

  const [editingModelIds, { toggle, has }] = useSet(new Set<string>())
  const editingModels = [...editingModelIds].map((ids) =>
    models.data?.find((m) => ids.includes(m._id)),
  )
  return (
    <div className="space-y-4">
      <ChatModelsDataTable models={models.data} />

      <div className="grid grid-cols-[auto_30%] gap-2">
        <div className="flex gap-2">
          {editingModels.map(
            (model) =>
              model && (
                <Card key={model._id} className="min-h-40 max-w-xl flex-1">
                  <ChatModelForm initialState={model} />
                </Card>
              ),
          )}
        </div>
      </div>
    </div>
  )
}
