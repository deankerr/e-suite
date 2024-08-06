import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'
import { ScrollArea } from '@radix-ui/themes'

import { IconButton } from '@/components/ui/Button'

const Shell = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden border-grayA-5 bg-gray-2 md:rounded-md md:border">
      {children}
    </div>
  )
}

const Header = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="flex-start h-10 shrink-0 overflow-hidden border-b border-grayA-3 px-1 font-medium">
      {children}
    </header>
  )
}

const Toolbar = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ToolbarPrimitive.Root className="flex-start h-10 shrink-0 border-b border-grayA-3 px-1">
      {children}
    </ToolbarPrimitive.Root>
  )
}

const Content = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ScrollArea scrollbars="vertical" className="grow">
      {children}
    </ScrollArea>
  )
}

const Footer = ({ children }: { children?: React.ReactNode }) => {
  return <div className="flex-start shrink-0 border-t border-grayA-3 px-1">{children}</div>
}

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton variant="ghost" aria-label="Close" className="ml-auto shrink-0" onClick={onClick}>
      <Icons.X size={20} />
    </IconButton>
  )
}

const Title = ({ children }: { children?: React.ReactNode }) => {
  return <div className="flex-start truncate px-1 text-sm font-medium">{children}</div>
}

export const Panel = Object.assign(Shell, { Header, Toolbar, Content, Footer, CloseButton, Title })
