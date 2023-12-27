import { cn } from '@/lib/utils'
import { Flex, Heading } from '@radix-ui/themes'

type FrameProps = {
  title?: string
  titlebar?: React.ReactNode
} & React.ComponentProps<typeof Flex>

export const Frame = ({ children, className, title, titlebar, ...props }: FrameProps) => {
  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      className={cn('divide-y divide-gray-5', className)}
      {...props}
    >
      <Flex p="2" justify="between" align="center" gap="2">
        <Heading size="3" as="h2">
          {title}
        </Heading>
        {titlebar}
        <Flex />
      </Flex>
      {children}
    </Flex>
  )
}
