import { Flex } from '@radix-ui/themes'
import { Sidebar } from './Sidebar'

type AppProps = {
  children?: React.ReactNode
}

export const App = ({ children }: AppProps) => {
  return (
    <Flex height="100%">
      <Sidebar />
      {children}
    </Flex>
  )
}
