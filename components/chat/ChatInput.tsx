import { Box, Flex, IconButton, TextArea } from '@radix-ui/themes'
import { SendHorizontalIcon } from 'lucide-react'

type ChatInputProps = {
  props?: any
}

export const ChatInput = ({ props }: ChatInputProps) => {
  return (
    <Box width="100%" py="2" px="2" className="border-t border-gray">
      <form className="flex w-full items-center gap-x-2">
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <TextArea id="chat" size="3" placeholder="Speak..." className="w-full" />
        <IconButton size="4" variant="surface">
          <SendHorizontalIcon strokeWidth="1" />
        </IconButton>
      </form>
    </Box>
  )
}
