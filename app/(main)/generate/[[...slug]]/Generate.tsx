'use client'

import { Button } from '@/app/components/ui/Button'
import { Sidebar } from '@/components/ui/Sidebar'
import { UIIconButton } from '@/components/ui/UIIconButton'
import { cn } from '@/lib/utils'
import { Heading } from '@radix-ui/themes'
import { SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type GenerateProps = {} & React.ComponentProps<'div'>

export const Generate = ({ className, ...props }: GenerateProps) => {
  const [sidebarLOpen, setSidebarLOpen] = useState(false)
  const [sidebarROpen, setSidebarROpen] = useState(false)

  return (
    <div {...props} className={cn('flex grow flex-col overflow-hidden', className)}>
      {/* header */}
      <div className="flex-between h-[--e-header-h] shrink-0 border-b px-3">
        {/* page title */}
        <div className="flex-between gap-2">
          <Heading size="3">Generate</Heading>
          <Heading size="4" className="text-accent-11">
            /
          </Heading>
          <Heading size="3">New</Heading>
        </div>

        {/* sidebar button */}
        <UIIconButton label="toggle sidebar" onClick={() => setSidebarLOpen(!sidebarLOpen)}>
          {sidebarLOpen ? <XIcon /> : <SlidersHorizontalIcon />}
        </UIIconButton>

        <UIIconButton label="toggle sidebar" onClick={() => setSidebarROpen(!sidebarROpen)}>
          {sidebarROpen ? <XIcon /> : <SlidersHorizontalIcon />}
        </UIIconButton>

        <div></div>
      </div>

      {/* main */}
      <div className="flex h-full">
        <Sidebar side="left" open={sidebarLOpen} onOpenChange={setSidebarLOpen}>
          <DummyText />
        </Sidebar>

        {/* content */}
        <div className="flex-center bg-grid-dark grow gap-5 border border-gold-5">
          <Button variant="solid" size="4" className="text-sm">
            East
          </Button>
          <Button variant="solid" color="gray">
            Generate
          </Button>
          <Button variant="outline" color="gray">
            Generate
          </Button>
          <Button variant="soft" color="gray">
            Generate
          </Button>
          <Button variant="ghost" color="gray">
            Generate
          </Button>
          <Button variant="soft" color="gray">
            Generate
          </Button>
          <Button variant="surface" color="gray">
            Generate
          </Button>
          <Button variant="solid" color="gray">
            Generate
          </Button>
          <Button variant="solid" size="4" className="text-sm">
            West
          </Button>
        </div>

        <Sidebar side="right" open={sidebarROpen} onOpenChange={setSidebarROpen}>
          <DummyText />
        </Sidebar>
      </div>
    </div>
  )
}

const DummyText = () => (
  <div>
    <Heading size="4">A Story</Heading>
    <p>
      Once upon a time, in a land far away, there lived a wise old owl named Oswald. Oswald was
      known throughout the kingdom for his exceptional wisdom and ability to solve even the most
      complex of problems.
    </p>

    <p>
      One day, a young rabbit named Roger came to Oswald with a dilemma. Roger had accidentally
      stumbled upon a hidden treasure, but he was unsure of what to do with it. He feared that if he
      kept the treasure for himself, he would be burdened with the responsibility of protecting it
      from those who might seek to steal it. On the other hand, if he were to share the treasure
      with others, he worried that it might be squandered or lost forever.
    </p>

    <p>
      Oswald listened patiently to Roger&#39;s tale, stroking his feathery chin in thought. After a
      moment of contemplation, he spoke. &quot;Roger, my dear friend,&quot; he began, &quot;I
      believe that the best course of action would be to share the treasure with your fellow
      creatures, but with certain conditions in place.&quot;
    </p>

    <p>
      Roger&#39;s eyes widened with curiosity. &quot;What kind of conditions?&quot; he asked
      eagerly.
    </p>

    <p>
      &quot;Firstly,&quot; Oswald continued, &quot;you must ensure that the treasure is used for the
      betterment of your community. Secondly, you must establish a council of wise and trustworthy
      animals to oversee the distribution and use of the treasure. And finally, you must make a
      solemn promise to protect the treasure and its legacy for future generations.&quot;
    </p>

    <p>
      Roger nodded his head in agreement, his heart swelling with gratitude for Oswald&#39;s wise
      counsel. With renewed determination, he set out to put Oswald&#39;s plan into action, knowing
      that he could now face the challenges ahead with confidence and courage.
    </p>

    <p>
      And so, the kingdom prospered under the guidance of Roger and his council of wise animals, all
      thanks to the sage advice of the wise old owl, Oswald.
    </p>
  </div>
)
