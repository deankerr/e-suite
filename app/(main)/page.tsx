import { Card, Heading } from '@radix-ui/themes'
import { GenerationFeed } from '../components/GenerationFeed'
import { GenerationForm } from '../components/section/GenerationForm'
import { TheSun } from '../components/ui/TheSun'
import { UserButton } from '../components/ui/UserButton'

export default function HomePage() {
  // HomePage

  return (
    <>
      <GenerationFeed className="pl-96 pr-8" />
      <Card className="ml-4 mt-4 h-fit shrink-0 place-self-start bg-panel-solid p-2">
        <div className="flex items-center">
          <TheSun />
          <UserButton />
        </div>
        <Heading size="3">Generate</Heading>
        <GenerationForm className="flex flex-col gap-2 pt-1" />
      </Card>
      {/* <GenerationBarDraggable /> */}
    </>
  )
}
