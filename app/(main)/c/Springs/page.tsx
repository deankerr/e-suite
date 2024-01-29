'use client'

import { getToggleAtom } from '@/app/components/atoms'
import { Spring1, Spring2 } from '@/app/components/Spring'
import { Slate } from '@/app/components/ui/Slate'
import { ToggleButton } from '@/app/components/ui/ToggleButton'
import { useAtom } from 'jotai'

export default function SpringsPage() {
  // SpringsPage

  const [springsTest] = useAtom(getToggleAtom('springsTest'))
  return (
    <Slate className="z-20 h-[80%] w-[80%] place-self-center">
      <p>SpringsPage</p>
      <ToggleButton name="springsTest" trueChildren="Springs on" falseChildren="Springs off" />

      {springsTest && <Spring1 />}
      {springsTest && <Spring2 />}
    </Slate>
  )
}
