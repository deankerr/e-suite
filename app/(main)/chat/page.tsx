import { PageFrame } from '@/components/PageFrame'
import { Box, Flex, Heading } from '@radix-ui/themes'
import { ModelsList } from './ModelsList'
import { ModelsSearch } from './ModelsSearch'

export default function ChatPage() {
  return (
    <PageFrame title="Chat">
      {/* Models column */}
      <Flex direction="column" pb="2" className="w-72 border-r border-gray-5">
        <Flex p="2" className="border-b border-gray-5">
          <Heading as="h3" size="2">
            Models
          </Heading>
        </Flex>
        <ModelsSearch px="2" py="2" justify="center" align="center" />
        <ModelsList />
      </Flex>

      {/* Chat frame */}
      <Flex direction="column" pb="2" grow="1">
        <Flex p="2" className="border-b border-gray-5">
          <Heading as="h3" size="2">
            Untitled Chat
          </Heading>
        </Flex>
      </Flex>
    </PageFrame>
  )
}
