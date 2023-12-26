import { Frame } from '@/components/Frame'
import { serverDao } from '@/data/server'
import { ChatSession } from './ChatSession'

type ChatProps = {} & React.ComponentProps<typeof Frame>

export const Chat = async ({ ...props }: ChatProps) => {
  const models = await serverDao.models.getAll()
  return (
    <Frame title="Untitled" {...props}>
      <ChatSession models={models} />
    </Frame>
  )
}
