import { serverDao } from '@/data/server'
import { Flex } from '@radix-ui/themes'
import { Suspense } from 'react'
import { Spinner } from '../../app/components/ui/Spinner'
import { ChatSession } from './ChatSession'

type ChatFrameProps = {
  props?: any
}

export const ChatFrame = async ({ props }: ChatFrameProps) => {
  const models = await serverDao.models.getAll()
  const resources = await serverDao.resources.getAll()

  return (
    <Flex direction="column" width="100%" height="100%" className="divide-y divide-gray-5">
      <Suspense fallback={<Spinner />}>
        <ChatSession models={models} resources={resources} />
      </Suspense>
    </Flex>
  )
}
