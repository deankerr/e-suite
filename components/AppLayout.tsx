import { LightboxProvider } from '@/components/lightbox/LightboxProvider'
import { Navigation } from '@/components/navigation/Navigation'
import { ModelsApiProvider } from '@/components/providers/ModelsApiProvider'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModelsApiProvider>
      <div className="flex h-dvh bg-midnight md:p-1.5">
        <Navigation />
        {children}
      </div>
      <LightboxProvider />
    </ModelsApiProvider>
  )
}
