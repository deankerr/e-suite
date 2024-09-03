import { Collection } from '@/components/collections/Collection'

export default function Page({ params }: { params: { collectionId: string } }) {
  return <Collection collectionId={params.collectionId} />
}
