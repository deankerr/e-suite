'use client'

import { ChatBuffer } from '@/components/chat/ChatBuffer'
import { ChatInput } from '@/components/chat/ChatInput'
import { useChat } from '@/components/chat/useChat'
import { Avatar, Box, Button, Card, Container, Flex, Heading, Text } from '@radix-ui/themes'

export default function AgentsPage() {
  // AgentsPage
  const chat = useChat()
  return (
    <Flex direction="column" width="100%" height="100%" className="divide-y divide-gray-5">
      <Box p="2">
        <Heading as="h1">Chat / Demo</Heading>
      </Box>

      <Box p="2">
        <Button variant="surface" size="1">
          All
        </Button>
      </Box>

      <Flex grow="1" className="divide-x divide-gray-5 overflow-y-hidden">
        <Flex direction="column" grow="1" className="max-w-4xl">
          <ChatBuffer messages={chat.messages} />
          <ChatInput />
        </Flex>

        <Box className="bg-panel-translucent" p="2" grow="1" shrink="0">
          <Heading as="h2">Side</Heading>
        </Box>
      </Flex>
    </Flex>
  )
}
