'use client'

import { Box, Flex, IconButton, TextArea } from '@radix-ui/themes'
import { SendHorizontalIcon } from 'lucide-react'
import { UseChatHelpers } from './useChat'

type ChatInputProps = {
  chat: UseChatHelpers
}

export const ChatInput = ({ chat }: ChatInputProps) => {
  return (
    <Box width="100%" py="2" px="2" className="border-t border-gray-5">
      <form className="flex w-full items-center gap-x-2" onSubmit={chat.handleSubmit}>
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <TextArea
          id="chat"
          size="2"
          placeholder="Speak..."
          className="w-full"
          value={chat.input}
          onChange={chat.handleInputChange}
        />
        <IconButton size="4" variant="surface" type="submit">
          <SendHorizontalIcon strokeWidth="1" />
        </IconButton>
      </form>
    </Box>
  )
}
