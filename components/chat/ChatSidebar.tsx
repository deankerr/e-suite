import { ChatModelCard } from '@/components/cards/ChatModelCard'
import { ImageModelCard } from '@/components/cards/ImageModelCard'
import { useChat } from '@/components/chat/ChatProvider'
import { useChatModels, useImageModels } from '@/lib/queries'
import { cn, getThreadConfig } from '@/lib/utils'

export const ChatSidebar = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { thread } = useChat()
  const config = getThreadConfig(thread)

  const chatModels = useChatModels()
  const chatModel =
    thread && chatModels.isSuccess
      ? chatModels.data.find(
          (model) =>
            model.model === config.chatCompletion?.model &&
            model.endpoint === config.chatCompletion.endpoint,
        )
      : undefined

  const imageModels = useImageModels()
  const imageModel =
    thread && imageModels.isSuccess
      ? imageModels.data.find(
          (model) =>
            model.model === config.textToImage?.model &&
            model.endpoint === config.textToImage.endpoint,
        )
      : undefined

  return (
    <div {...props} className={cn('h-full w-80 shrink-0 border-r border-grayA-3 p-4', className)}>
      {chatModel && <ChatModelCard model={chatModel} className="mx-auto" />}
      {imageModel && <ImageModelCard model={imageModel} className="mx-auto" />}
    </div>
  )
}
