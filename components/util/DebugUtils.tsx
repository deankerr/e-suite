import { cn } from '@/lib/utils'
import { Heading } from '@radix-ui/themes'
import { SquirrelIcon } from 'lucide-react'
import { useRef } from 'react'

export const DebugCornerMarkers = ({
  n,
  cN: className,
  no,
}: {
  n?: number
  cN?: React.ComponentProps<'div'>['className']
  no?: boolean
}) => {
  const int = useRef(n ?? rndInt())
  if (no) return null
  return (
    <>
      <div className="absolute left-1 top-1">
        <SquirrelIcon className={cn('size-5', textColor(int.current), className)} />
      </div>
      <div className="absolute right-1 top-1">
        <SquirrelIcon className={cn('size-5', textColor(int.current), className)} />
      </div>
      <div className="absolute bottom-1 left-1">
        <SquirrelIcon className={cn('size-5', textColor(int.current), className)} />
      </div>
      <div className="absolute bottom-1 right-1">
        <SquirrelIcon className={cn('size-5', textColor(int.current), className)} />
      </div>
    </>
  )
}

const colors = [
  'text-tomato',
  'text-crimson',
  'text-pink',
  'text-purple',
  'text-iris',
  'text-cyan',
  'text-grass',
  'text-amber',
]

const textColor = (num: number) => colors[num % 8]!
const rndInt = () => Math.floor(Math.random() * 8)

export const DummyText = () => (
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
