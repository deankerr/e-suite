'use client'

import { cn } from '@/lib/utils'
import { Box, Button, Flex, Heading } from '@radix-ui/themes'
import { ChatBuffer } from './ChatBuffer'
import { ChatInput } from './ChatInput'
import { useChat } from './useChat'

type ChatProps = {} & React.ComponentProps<typeof Flex>

export const Chat = ({ className, ...props }: ChatProps) => {
  const chat = useChat()
  return (
    <Flex
      direction="column"
      grow="1"
      className={cn('divide-y divide-gray-5', className)}
      {...props}
    >
      <Flex px="2" py="2" justify="between" className="">
        <Heading size="3" as="h3">
          Untitled
        </Heading>
        <Flex gap="1">
          <Button variant="surface" size="1">
            Agent
          </Button>
          <Button variant="surface" size="1">
            Save
          </Button>
          <Button variant="surface" color="red" size="1">
            Delete
          </Button>
        </Flex>
      </Flex>
      <ChatBuffer messages={chat.messages} />
      <ChatInput />
    </Flex>
  )
}
