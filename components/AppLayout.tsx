import { LightboxProvider } from '@/components/lightbox/LightboxProvider'
import { Navigation } from '@/components/navigation/Navigation'
import { ModelsApiProvider } from '@/components/providers/ModelsApiProvider'
import { ShellC } from '@/components/shell/Shell'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModelsApiProvider>
      <div className="flex h-dvh bg-midnight md:p-1.5">
        <Navigation />
        <div className="h-full w-full md:ml-60">{children}</div>
      </div>
      <LightboxProvider />
      <ShellC />
    </ModelsApiProvider>
  )
}
