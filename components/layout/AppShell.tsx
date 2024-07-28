import { LightboxProvider } from '@/components/lightbox/LightboxProvider'
import { Navigation } from '@/components/navigation/Navigation'
import { ModelsApiProvider } from '@/components/providers/ModelsApiProvider'
import { ShellC } from '@/components/shell/Shell'

export const AppShell = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ModelsApiProvider>
      <div className="flex h-dvh bg-midnight md:gap-1.5 md:p-1.5">
        <Navigation />
        {children}
      </div>
      <LightboxProvider />
      <ShellC />
    </ModelsApiProvider>
  )
}
