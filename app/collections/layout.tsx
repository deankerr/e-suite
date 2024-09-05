import { CollectionsNavPanel } from '@/components/collections/CollectionsNavPanel'

export const metadata = {
  title: 'Collections',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CollectionsNavPanel />
      {children}
    </>
  )
}
