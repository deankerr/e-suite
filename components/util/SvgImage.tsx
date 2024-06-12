import Image from 'next/image'

import Noun1 from '@/assets/svg/noun1.svg'
import Noun2 from '@/assets/svg/noun2.svg'
import Noun3 from '@/assets/svg/noun3.svg'
import Noun4 from '@/assets/svg/noun4.svg'
import Noun5 from '@/assets/svg/noun5.svg'
import Noun6 from '@/assets/svg/noun6.svg'
import Noun7 from '@/assets/svg/noun7.svg'
import Noun8 from '@/assets/svg/noun8.svg'
import Noun9 from '@/assets/svg/noun9.svg'
import Noun10 from '@/assets/svg/noun10.svg'
import Noun11 from '@/assets/svg/noun11.svg'
import Noun12 from '@/assets/svg/noun12.svg'
import Noun13 from '@/assets/svg/noun13.svg'
import Noun14 from '@/assets/svg/noun14.svg'
import Noun15 from '@/assets/svg/noun15.svg'
import Noun16 from '@/assets/svg/noun16.svg'
import Noun17 from '@/assets/svg/noun17.svg'
import Noun18 from '@/assets/svg/noun18.svg'
import Noun19 from '@/assets/svg/noun19.svg'
import Noun20 from '@/assets/svg/noun20.svg'
import Noun21 from '@/assets/svg/noun21.svg'
import Noun22 from '@/assets/svg/noun22.svg'
import Noun23 from '@/assets/svg/noun23.svg'
import Noun24 from '@/assets/svg/noun24.svg'
import Noun25 from '@/assets/svg/noun25.svg'
import Noun26 from '@/assets/svg/noun26.svg'
import Noun27 from '@/assets/svg/noun27.svg'
import { cn } from '@/lib/utils'

const nouns = [
  Noun1,
  Noun2,
  Noun3,
  Noun4,
  Noun5,
  Noun6,
  Noun7,
  Noun8,
  Noun9,
  Noun10,
  Noun11,
  Noun12,
  Noun13,
  Noun14,
  Noun15,
  Noun16,
  Noun17,
  Noun18,
  Noun19,
  Noun20,
  Noun21,
  Noun22,
  Noun23,
  Noun24,
  Noun25,
  Noun26,
  Noun27,
]

export const SvgImage = ({
  noun,
  className,
  ...props
}: { noun: number } & Partial<React.ComponentProps<typeof Image>>) => {
  const src = nouns[noun - 1]
  if (!src) throw new Error('invalid noun')
  return <Image {...props} src={src} alt="" className={cn('', className)} />
}
