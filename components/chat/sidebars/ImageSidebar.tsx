import { Tabs } from '@radix-ui/themes'

import { ImageModelCard } from '@/components/cards/ImageModelCard'
import { SlashCommandCard } from '@/components/cards/SlashCommandCard'
import { ETextToImageInference } from '@/convex/shared/structures'
import { EImageModel, EThread } from '@/convex/shared/types'

export const ImageSidebar = ({ thread }: { thread: EThread; config: ETextToImageInference }) => {
  const model = thread.model?.type === 'image' ? (thread.model as EImageModel) : null

  return (
    <Tabs.Root defaultValue="commands">
      <Tabs.List>
        <Tabs.Trigger value="model">Model</Tabs.Trigger>
        <Tabs.Trigger value="commands">Commands</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="model">
        <div className="p-2 flex-col-center">{model && <ImageModelCard model={model} />}</div>
      </Tabs.Content>
      <Tabs.Content value="commands">
        <div className="p-2">
          <div className="font-medium">Commands</div>

          <div className="flex flex-col gap-3">
            {thread.config.saved.map((command, i) => (
              <SlashCommandCard key={i} command={command} />
            ))}
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}
