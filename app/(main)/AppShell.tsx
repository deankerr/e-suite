import { Flex } from '@radix-ui/themes'
import { AppSidebar } from './AppSidebar'

type AppShellProps = {
  children?: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <Flex height="100%">
      <AppSidebar />
      <div className="flex w-full p-5 pl-0">{children}</div>
    </Flex>
  )
}
