'use client'

import { BShell } from './BShell'

const EComp = () => (
  <BShell.Root className="max-h-[80vh]">
    <BShell.Titlebar>Titlebar</BShell.Titlebar>
    <BShell.Content>Content</BShell.Content>
  </BShell.Root>
)
export default EComp
