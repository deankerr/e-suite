import { PageFrame } from '@/components/PageFrame'
import { serverDao } from '@/data/server'
import { Spinner } from '../ui/Spinner'
import { ChatSession } from './ChatSession'

type ChatProps = {} & React.ComponentProps<typeof PageFrame>

export const Chat = async ({ ...props }: ChatProps) => {
  const models = await serverDao.models.getAll()
  const resources = await serverDao.resources.getAll()

  return (
    <PageFrame title="Untitled Chat" {...props}>
      <ChatSession models={models} resources={resources} />
    </PageFrame>
  )
}
