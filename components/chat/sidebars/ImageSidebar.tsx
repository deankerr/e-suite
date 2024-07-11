import { Tabs } from '@radix-ui/themes'

import { ImageModelCardH } from '@/components/cards/ImageModelCard'
import { SlashCommandCard } from '@/components/cards/SlashCommandCard'
import { EImageModel, EThread } from '@/convex/types'
import { useViewerDetails } from '@/lib/queries'

import type { TextToImageConfig } from '@/convex/types'

export const ImageSidebar = ({ thread }: { thread: EThread; config: TextToImageConfig }) => {
  const { isOwner } = useViewerDetails(thread.userId)
  const model = thread.model?.type === 'image' ? (thread.model as EImageModel) : null

  return (
    <Tabs.Root defaultValue="model">
      <Tabs.List>
        <Tabs.Trigger value="model">Model</Tabs.Trigger>
        <Tabs.Trigger value="commands" className={isOwner ? '' : 'hidden'}>
          Commands
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="model">
        <div className="p-2 flex-col-center">{model && <ImageModelCardH model={model} />}</div>
      </Tabs.Content>
      <Tabs.Content value="commands">
        <div className="p-2">
          <div className="font-medium">Commands</div>

          <div className="flex flex-col gap-3">
            {thread.slashCommands.map((command, i) => (
              <SlashCommandCard key={i} command={command} />
            ))}
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}
