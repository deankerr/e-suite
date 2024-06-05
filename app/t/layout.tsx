import { MainLayout } from '@/components/layout/MainLayout'

export const metadata = {
  title: 'MultiThread',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}
