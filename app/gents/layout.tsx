import { ClientLayout } from '@/app/gents/ClientLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ClientLayout />
    </>
  )
}
