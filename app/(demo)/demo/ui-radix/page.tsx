import { IconButton as PButton } from '@/components/ui/Button'
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

export default function Page() {
  // Page

  return (
    // <Box className="h-full w-full">
    <Flex className="h-full w-full">
      <Box width="8" className="bg-red-100">
        Sidebar
      </Box>
      <Box className="w-full bg-amber-800">
        Content
        <Box height="1" className="max-w-xs bg-sky-500">
          Box2
        </Box>
      </Box>
    </Flex>
    // </Box>
  )
}
