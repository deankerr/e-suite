import { cn } from '@/lib/utils'
import { Box, Flex, Heading } from '@radix-ui/themes'

type PageFrameProps = {
  title?: string
  children?: React.ReactNode
}

export const PageFrame = ({ children, title }: PageFrameProps) => {
  return (
    <Flex direction="column" width="100%" className="h-full overflow-hidden">
      <Flex p="2" justify="between" align="center" gap="2" className="border-b border-gray-5">
        <Heading size="3" as="h2">
          {title}
        </Heading>
      </Flex>
      <Flex grow="1" className="overflow-hidden">
        {children}
      </Flex>
    </Flex>
  )
}
