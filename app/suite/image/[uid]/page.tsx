import { ImageDetailsPanel } from '@/components/panel/ImageDetailsPanel'

export default function Page({ params }: { params: { uid: string } }) {
  return <ImageDetailsPanel imageUid={params.uid} />
}
