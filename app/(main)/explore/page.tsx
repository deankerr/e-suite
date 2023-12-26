import { Chat } from '@/components/chat/Chat'
import { serverDao } from '@/data/server'
import { Box, Flex, Heading } from '@radix-ui/themes'
import { Suspense } from 'react'

export default async function ExplorePage() {
  return (
    <Flex direction="column" width="100%" height="100%" className="divide-y divide-gray-5">
      <Box p="2">
        <Heading as="h2">Explore</Heading>
      </Box>

      <Flex grow="1" className="divide-x divide-gray-5 overflow-y-hidden">
        <Chat className="max-w-3xl" />
      </Flex>
    </Flex>
  )
}
