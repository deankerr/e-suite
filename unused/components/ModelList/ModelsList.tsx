import { serverDao } from '@/data/server'
import { Box, Flex, ScrollArea, Text } from '@radix-ui/themes'

type ModelsListProps = {
  props?: any
} & React.ComponentProps<typeof Flex>

export const ModelsList = async ({ className }: ModelsListProps) => {
  const models = await serverDao.models.getAll()
  const resources = await serverDao.resources.getAll()
  return (
    <ScrollArea>
      <Flex direction="column" px="1" className="divide-y divide-gray-3">
        {models.map((m) => (
          <Box
            key={m.id}
            px="1"
            py="1"
            className="text-gray-11 hover:cursor-pointer hover:bg-gray-3 hover:text-gray-12"
          >
            <Box px="1">
              <Text as="span" size="2">
                {m.name}
              </Text>
            </Box>
          </Box>
        ))}
      </Flex>
    </ScrollArea>
  )
}
