'use client'

import { Shell } from 'lucide-react'
import { useValue } from 'react-cosmos/client'
import { CShell } from './CShell'

const EComp = () => {
  const [leftBarOpen] = useValue('leftbar open', { defaultValue: false })
  const [rightBarOpen] = useValue('rightbar open', { defaultValue: true })

  return (
    <CShell.Root>
      <CShell.Section className="bg-gray-1" open={leftBarOpen} width={228}>
        Left Sidebar
      </CShell.Section>

      <CShell.Section className="bg-panel-translucent">
        <CShell.Titlebar icon={<Shell className="size-5 stroke-1" />}>
          Main Titlebar
        </CShell.Titlebar>
        Main Content
      </CShell.Section>

      <CShell.Section className="bg-gray-1" open={rightBarOpen} side="right" width={228}>
        Right Sidebar
      </CShell.Section>
    </CShell.Root>
  )
}
export default EComp
