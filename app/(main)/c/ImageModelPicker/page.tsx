import { ApiListView } from '@/app/components/Shell/ApiListView'
import { ImageModelPicker } from '@/app/components/Shell/ImageModelPicker'

export default function Page() {
  // Page

  return (
    <div className="grid h-lvh grid-cols-2 gap-4 p-4">
      <ImageModelPicker />
      <ApiListView />
    </div>
  )
}
