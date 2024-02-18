'use client'

import { IconButton } from '@/app/components/ui/IconButton'
import { TextArea } from '@/app/components/ui/TextArea'
import { Label } from '@radix-ui/react-label'
import { Heading, ScrollArea, Slider, TextFieldInput } from '@radix-ui/themes'
import { Shell } from 'lucide-react'
import { useValue } from 'react-cosmos/client'
import { CShell } from './CShell'

const EComp = () => {
  const [enableLeft] = useValue('enable left bar', { defaultValue: false })
  return (
    <CShell.Root className="mx-auto">
      {enableLeft && (
        <CShell.Sidebar side="left">
          <CShell.Titlebar className="justify-center">
            <Heading size="2">LeftSidebar</Heading>
          </CShell.Titlebar>

          <ScrollArea>
            <div className="space-y-2 px-2 py-2">
              <ASCIIRocket />
              <p>Boom</p>
            </div>
          </ScrollArea>
        </CShell.Sidebar>
      )}

      <CShell.Content>
        <CShell.Titlebar className="justify-between bg-gray-1">
          <IconButton lucideIcon={Shell} variant="ghost" className="m-0" />
          <Heading size="2">CShell</Heading>
          <CShell.SidebarToggle side="right" className="opacity-0" />
        </CShell.Titlebar>

        <ScrollArea>
          <div className="space-y-2 p-2"></div>
        </ScrollArea>
      </CShell.Content>

      <CShell.Sidebar side="right">
        <CShell.Titlebar className="justify-center">
          <Heading size="2">RightSidebar</Heading>
        </CShell.Titlebar>

        <ScrollArea>
          <div className="space-y-2 p-2"></div>
        </ScrollArea>
      </CShell.Sidebar>
    </CShell.Root>
  )
}
export default EComp

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SampleForm = () => (
  <div className="space-y-4 px-2">
    <div>
      <Label>System prompt</Label>
      <TextArea className="sm:text-sm" minRows={3} maxRows={6} />
    </div>

    <div className="">
      <Label>Name</Label>
      <TextFieldInput />
    </div>

    <div className="">
      <Label>stop string</Label>
      <TextFieldInput />
    </div>

    <div className="">
      <Label>Honesty</Label>
      <Slider min={1} max={100} defaultValue={[50]} />
    </div>

    <div className="">
      <Label>Humour</Label>
      <Slider min={1} max={100} defaultValue={[50]} />
    </div>

    <div className="">
      <Label>Verbosity</Label>
      <Slider min={1} max={100} defaultValue={[50]} />
    </div>

    <div>
      <Label>Notes</Label>
      <TextArea className="sm:text-sm" minRows={6} maxRows={8} />
    </div>
  </div>
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    <p>
      Nestled amidst the arid landscapes of Kuwait lies a sight that is starkly at odds with the
      surrounding desert—a vast expanse turning the horizon black, known as the world‘s largest tire
      graveyard. In the quarries of Sulaibiya, millions of discarded tires from all over the
      country, and even from other countries, come to their final resting place. These colossal
      mounds of rubber present a jarring environmental challenge, as they are both visually and
      ecologically disruptive. The sheer scale of this rubber repository can be seen from space,
      making it an unnatural landmark of the region.
    </p>

    <p>
      The proliferation of tire graveyards around the globe is symptomatic of the broader issue of
      tire waste management. Tires are made to be durable and withstand friction, heat, and heavy
      loads, which makes them incredibly tough to break down naturally. The materials used in tire
      production, such as synthetic rubber, steel wires, and carbon black, are designed for
      resilience, resulting in products that can take centuries to decompose in landfills. In an era
      where sustainability is becoming ever more critical, the quest for environmentally friendly
      disposal methods is gaining momentum, with recycling and repurposing efforts at the forefront
      of this battle against pollution.
    </p>

    <p>
      Kuwait‘s tire graveyard has prompted initiatives to repurpose these symbols of waste into
      material that can be reused in various applications. One of the innovative solutions is to
      shred the tires and use them in the creation of asphalt, which not only helps with waste
      reduction but also improves road quality. Moreover, shredded tires have found usage in various
      industries, including the construction of playgrounds, sports fields, and even in fuel
      generation. These efforts are vital in mitigating the threat such waste poses to the
      environment, yet the magnitude of the tire graveyard is a stark reminder that consumption and
      disposal practices on a global scale must evolve to address such daunting ecological
      challenges.
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
