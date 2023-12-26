import { Frame } from '@/components/Frame'
import { serverDao } from '@/data/server'
import { ChatSession } from './ChatSession'

type ChatProps = {} & React.ComponentProps<typeof Frame>

export const Chat = async ({ ...props }: ChatProps) => {
  const models = await serverDao.models.getAll()
  const resources = await serverDao.resources.getAll()

  return (
    <Frame title="Untitled Chat" {...props}>
      <ChatSession models={models} resources={resources} />
    </Frame>
  )
}
