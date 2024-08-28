'use client'

import { useState } from 'react'
import { Tabs } from '@radix-ui/themes'
import fuzzysort from 'fuzzysort'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { ModelsTable } from '@/app/admin/chat-models/ModelsTable'
import { ChatModelCard } from '@/components/cards/ChatModelCard'
import { SearchField } from '@/components/ui/SearchField'
import { useModels } from '@/lib/api'

export default function Page() {
  const { chatModels } = useModels()
  const [searchValue, setSearchValue] = useState('')

  const sortResults = fuzzysort.go(searchValue, chatModels ?? [], {
    keys: ['resourceKey', 'name', 'creatorName'],
    all: true,
  })
  const modelsList = sortResults.map(({ obj }) => obj)

  return (
    <AdminPageWrapper>
      <Tabs.Root defaultValue="table">
        <Tabs.List>
          <Tabs.Trigger value="badges">Badges</Tabs.Trigger>
          <Tabs.Trigger value="table">Table</Tabs.Trigger>
        </Tabs.List>

        <div className="mt-2">
          <div className="space-y-2 py-2">
            <SearchField value={searchValue} onValueChange={setSearchValue} />
            <div className="px-1 font-mono text-sm">
              {chatModels && `chat models: ${sortResults.length}`}
            </div>
          </div>

          <Tabs.Content value="badges">
            <div className="flex flex-wrap gap-2">
              {sortResults.map(({ obj: model }) => (
                <ChatModelCard key={model._id} model={model} />
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="table">
            <ModelsTable models={modelsList} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </AdminPageWrapper>
  )
}
