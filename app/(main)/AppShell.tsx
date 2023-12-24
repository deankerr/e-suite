import { Flex } from '@radix-ui/themes'
import { AppSidebar } from './AppSidebar'

type AppShellProps = {
  children?: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <Flex height="100%">
      <AppSidebar />
      {children}
    </Flex>
  )
}
