import { LightboxProvider } from '@/components/lightbox/LightboxProvider'
import { Navigation } from '@/components/navigation/Navigation'
import { MessagesQueryProvider } from '@/components/providers/MessagesQueryProvider'
import { ShellC } from '@/components/shell/Shell'
import { ConvexClientLogger } from '@/components/util/ConvexClientLogger'

export const AppShell = ({ children }: { children?: React.ReactNode }) => {
  return (
    <MessagesQueryProvider>
      <div className="flex h-dvh bg-midnight md:gap-1.5 md:p-1.5">
        <Navigation />
        {children}
      </div>
      <LightboxProvider />
      <ShellC />
      <ConvexClientLogger />
    </MessagesQueryProvider>
  )
}
