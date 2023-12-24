import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  IconButton,
  Text,
} from '@radix-ui/themes'

export default function RadixDemoPage() {
  // Page

  return (
    <Flex className="h-full w-full">
      <Box width="8" className="bg-red-100">
        Sidebar
      </Box>
      <Box className="bg-amber-800 w-full">
        Content
        <Box height="1" className="bg-sky-500 max-w-xs">
          Box2
        </Box>
      </Box>
    </Flex>
  )
}
