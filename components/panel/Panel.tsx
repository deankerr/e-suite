import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'

import { AppLogo } from '@/components/icons/AppLogo'
import { IconButton } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

const Shell = ({
  children,
  loading = false,
}: {
  loading?: boolean
  children?: React.ReactNode
}) => {
  return (
    <div className="hidden h-full w-full flex-col overflow-hidden border-grayA-5 bg-gray-2 transition-colors last:flex md:flex md:rounded-md md:border">
      {loading && (
        <div className="absolute inset-0 flex bg-gray-1">
          <AppLogo className="text-mauve-3 m-auto size-48 animate-pulse" />
        </div>
      )}
      {children}
    </div>
  )
}

const Header = ({
  loading = false,
  children,
}: {
  loading?: boolean
  children?: React.ReactNode
}) => {
  return (
    <header className="flex-start h-10 shrink-0 overflow-hidden border-b border-grayA-3 bg-gray-2 px-1 font-medium">
      {loading ? (
        <div className="flex-start w-full animate-pulse gap-2 px-1">
          <Skeleton className="bg-mauve-3 h-5 w-8 animate-none" />
          <Skeleton className="bg-mauve-3 h-5 w-48 animate-none" />
          <Skeleton className="bg-mauve-3 h-5 grow animate-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-2" />
        </div>
      ) : (
        children
      )}
    </header>
  )
}

const Toolbar = ({
  loading = false,
  children,
}: {
  loading?: boolean
  children?: React.ReactNode
}) => {
  return (
    <ToolbarPrimitive.Root className="flex-start h-10 shrink-0 border-b border-grayA-3 bg-gray-2 px-1">
      {loading ? (
        <div className="flex-start w-full animate-pulse gap-2 px-1">
          <Skeleton className="bg-mauve-3 h-5 w-8 animate-none" />
          <Skeleton className="bg-mauve-3 h-5 w-8 animate-none" />
          <Skeleton className="bg-mauve-3 h-5 w-16 animate-none" />
          <Skeleton className="bg-mauve-3 h-5 w-32 animate-none" />
          <Skeleton className="bg-mauve-3 h-5 grow animate-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-2" />
        </div>
      ) : (
        children
      )}
    </ToolbarPrimitive.Root>
  )
}

const Content = ({ children }: { children?: React.ReactNode }) => {
  return <div className="grow overflow-hidden">{children}</div>
}

const Footer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex-start shrink-0 border-t border-grayA-3 bg-gray-2 px-1">{children}</div>
  )
}

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton
      variant="ghost"
      color="gray"
      aria-label="Close"
      className="ml-auto"
      onClick={onClick}
    >
      <Icons.X size={20} />
    </IconButton>
  )
}

const Title = ({ children }: { children?: React.ReactNode }) => {
  return <div className="flex-start truncate px-1 text-sm font-medium">{children}</div>
}

export const Panel = Object.assign(Shell, { Header, Toolbar, Content, Footer, CloseButton, Title })
