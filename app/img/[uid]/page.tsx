import { ImageDetailsPanel } from '@/components/panel/ImageDetailsPanel'
import { AppTitle } from '@/components/ui/AppTitle'

export default function Page({ params }: { params: { uid: string } }) {
  return (
    <div className="flex h-dvh flex-col p-1">
      <div className="flex shrink-0 rounded-md border border-grayA-3 p-3">
        <AppTitle />
      </div>
      <div className="grow overflow-hidden">
        <ImageDetailsPanel imageUid={params.uid} />
      </div>
    </div>
  )
}
