import { serverDao } from '@/data/server'
import { ChatSession } from './ChatSession'

type ChatProps = {}

export const Chat = async ({ ...props }: ChatProps) => {
  const models = await serverDao.models.getAll()
  const resources = await serverDao.resources.getAll()

  return (
    <div title="Untitled Chat" {...props}>
      <ChatSession models={models} resources={resources} />
    </div>
  )
}
