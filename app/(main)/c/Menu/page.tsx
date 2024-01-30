import { MenuBar } from '@/app/components/MenuBar'
import { Slate } from '@/app/components/ui/Slate'

export default function MenuPage() {
  // MenuPage

  return (
    <Slate className="place-contXent-center grid h-[85vh] w-[85vw] place-self-center bg-panel-solid">
      <MenuBar />
    </Slate>
  )
}
