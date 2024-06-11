'use client'

import { Tabs } from '@radix-ui/themes'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { ImageModelCard } from '@/app/admin/image-models/ImageModelCard'
import { useImageModels } from '@/lib/queries'

export default function Page() {
  const imageModels = useImageModels()
  return (
    <AdminPageWrapper className="">
      <Tabs.Root defaultValue="browse">
        <Tabs.List>
          <Tabs.Trigger value="browse">Browse</Tabs.Trigger>
          <Tabs.Trigger value="table">Table</Tabs.Trigger>
        </Tabs.List>

        <div className="py-2">
          <Tabs.Content value="browse">
            <p>Browse</p>
            {imageModels.isSuccess && (
              <div className="space-y-4">
                {imageModels.data.slice(0, 4).map((model) => (
                  <ImageModelCard key={model._id} model={model} />
                ))}
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="table">
            <p>Table</p>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </AdminPageWrapper>
  )
}
