import { CollectionsList } from '@/components/collections/CollectionsList'

export const metadata = {
  title: 'Collections',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CollectionsList />
      {children}
    </>
  )
}
