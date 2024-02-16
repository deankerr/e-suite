'use client'

import { Heading } from '@radix-ui/themes'
import { deepEqual } from 'fast-equals'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useValue } from 'react-cosmos/client'
import { DebugCornerMarkers } from '../util/DebugUtils'
import { CShell } from './CShell'
import { createShellContextAtom, sidebarConfigWidths } from './shell.atoms'

const config = {
  leftOpen: false,
  leftFloating: false,
  leftWidth: 256,
  rightOpen: true,
  rightFloating: false,
  rightWidth: 256,
} as const

const shellAtom = createShellContextAtom(config)
const EComp = () => {
  const [lockConfig] = useValue('lock config', {
    defaultValue: true,
  })
  const [shellConfig] = useValue('shell config', {
    defaultValue: config,
  })
  const [cornerHelpers] = useValue('cornerHelpers', {
    defaultValue: false,
  })

  const [shell, setShell] = useAtom(shellAtom)

  const configIsEqual = deepEqual(shellConfig, shell)

  useEffect(() => {
    if (lockConfig && !configIsEqual) setShell(shellConfig)
  }, [configIsEqual, shellConfig, setShell, lockConfig])

  return (
    <CShell.Root shellAtom={shellAtom} className="mx-auto">
      <CShell.LeftSidebar titlebar={<Heading size="2">LeftSidebar</Heading>}>
        <div className="">
          <p>Floating: {String(shell.leftFloating)}</p>
          <DebugCornerMarkers no={!cornerHelpers} />
        </div>
      </CShell.LeftSidebar>

      <CShell.Content className="text-sm" titlebar={<Heading size="2">CShell</Heading>}>
        <div className="space-y-2 p-2">
          <p>Widths: {sidebarConfigWidths.join(', ')}</p>
          <SampleText />
        </div>
        <DebugCornerMarkers no={!cornerHelpers} />
      </CShell.Content>

      <CShell.RightSidebar titlebar={<Heading size="2">RightSidebar</Heading>}>
        <div className="">
          Floating: {String(shell.rightFloating)}
          <ASCIIRocket />
          <DebugCornerMarkers no={!cornerHelpers} />
        </div>
      </CShell.RightSidebar>
    </CShell.Root>
  )
}
export default EComp

const SampleText = () => (
  <>
    <p>
      Lay testing, often referred to as user testing or hands-on evaluation, is a critical phase in
      the development of a wide range of products, from software applications to physical devices.
      This process involves real-world users interacting with a product in its development stage to
      identify potential issues and gather useful feedback. The primary goal is to ensure that the
      end product meets user expectations and is both intuitive and accessible to its target
      audience. By including lay testers from diverse backgrounds and skill levels, product
      developers can gain a broad perspective on how the product will perform in various real-world
      scenarios.
    </p>

    <p>
      The methodology behind lay testing varies depending on the product and industry. Typically, it
      begins with the selection of a representative sample of potential end-users who match the
      demographic of the target market. These individuals are then introduced to the product under
      controlled conditions, where their interactions are either observed directly by the developers
      or recorded for subsequent analysis. Lay testers are often provided with specific tasks or
      scenarios to work through, allowing developers to understand how users approach these
      challenges and where they may encounter difficulties. Testers are encouraged to think aloud,
      offering a verbal account of their thought process, which can provide clear insights into user
      experience and pain points.
    </p>

    <p>
      After the conclusion of the test sessions, the accumulated data is carefully reviewed and
      categorized to identify patterns and commonalities in the user experience. This feedback is
      invaluable for the development team as it guides the iteration and refinement of the product.
      Change requests are prioritized based on the nature and frequency of the issues encountered
      during testing. It‘s not uncommon for lay testing to reveal unexpected uses or misuses of the
      product, leading to a deeper understanding of user behavior and potentially inspiring new
      features or design changes. Ultimately, the insights gained through lay testing play a
      critical role in creating a more user-friendly, efficient, and satisfying product.
    </p>
  </>
)

const ASCIIRocket = () => (
  <pre className="whitespace-pre-wrap">{`
    |  
   /_\\  
  |___|
  | S |
  | P |
  | I |
  | C |
  | E |
  |___|
  |___|
  | G |
  | I |
  | R |
  | L |
  | S |
  |___|
  |___|
  |   |
  |   |
  |   |
 /     \\ 
|_______|
  `}</pre>
)
