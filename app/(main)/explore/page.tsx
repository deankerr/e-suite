import { Chat } from '@/components/chat/Chat'
import { ChatBuffer } from '@/components/chat/ChatBuffer'
import { ChatInput } from '@/components/chat/ChatInput'
import { Box, Button, Flex, Heading } from '@radix-ui/themes'

export default function ExplorePage() {
  // ExplorePage

  return (
    <Flex direction="column" width="100%" height="100%" className="divide-y divide-gray-5">
      <Box p="2">
        <Heading as="h2">Explore</Heading>
      </Box>

      {/* <Box p="2">
        <Button variant="surface" size="1">
          All
        </Button>
      </Box> */}

      <Flex grow="1" className="divide-x divide-gray-5 overflow-y-hidden">
        <Chat className="max-w-3xl" />
        <Box />
      </Flex>
    </Flex>
  )
}
