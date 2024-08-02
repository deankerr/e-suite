import { LightboxProvider } from '@/components/lightbox/LightboxProvider'
import { Navigation } from '@/components/navigation/Navigation'
import { ShellC } from '@/components/shell/Shell'

export const AppShell = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <div className="flex h-dvh bg-midnight md:gap-1.5 md:p-1.5">
        <Navigation />
        {children}
      </div>
      <LightboxProvider />
      <ShellC />
    </>
  )
}
