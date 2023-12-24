import { Avatar, Box, Card, Flex } from '@radix-ui/themes'
import type { UseChatHelpers } from 'ai/react'
import dynamic from 'next/dynamic'

const Markdown = dynamic(() => import('@/components/util/Markdown'), { ssr: false })

type ChatBubbleProps = {
  message: UseChatHelpers['messages'][0]
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  return (
    <Flex gap="4">
      <Box>
        <Avatar
          src="https://source.boringavatars.com/beam/120/${nanoid(5)}?square"
          variant="solid"
          size="4"
          fallback="?"
        />
      </Box>
      <Card className="w-[65ch]">
        <Markdown className="prose prose-sm prose-gray w-full dark:prose-invert">
          {message.content}
        </Markdown>
      </Card>
    </Flex>
  )
}
