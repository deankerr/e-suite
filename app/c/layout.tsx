import { MainLayout } from '@/components/layout/MainLayout'

export const metadata = {
  title: 'Chats',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}
