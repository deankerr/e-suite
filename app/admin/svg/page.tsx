import Image from 'next/image'

import BioBg from '@/assets/svg/bio-bg.svg'
import HexBg from '@/assets/svg/hex-bg.svg'
import HexMono from '@/assets/svg/hex-mono.svg'
import Hex from '@/assets/svg/hex.svg'
import Noun3_1 from '@/assets/svg/noun3-1.svg'
import { SvgImage } from '@/components/util/SvgImage'

export const metadata = {
  title: 'SVG',
}

export default function Page() {
  return (
    <div className="flex h-screen flex-wrap gap-3 p-3">
      {[...Array(27)].map((_, i) => (
        <SvgImage key={i} noun={i + 1} className="h-40 w-40" />
      ))}
      <Image src={Noun3_1} alt="" className="h-40 w-40" />
      <Image src={BioBg} alt="" className="h-40 w-40" />
      <Image src={HexBg} alt="" className="h-40 w-40" />
      <Image src={HexMono} alt="" className="h-40 w-40" />
      <Image src={Hex} alt="" className="h-40 w-40" />

      {publicSvgs.map((svg) => (
        <div key={svg} className="colorize-svg">
          <Image src={`/svg/${svg}`} alt="" width={512} height={512} className="h-40 w-40" />
        </div>
      ))}
    </div>
  )
}

const publicSvgs = [
  'noun-abstract-geometric-atom-947214.svg',
  'noun-abstract-halftone-lines-circle-4557061.svg',
  'noun-ant-65334.svg',
  'noun-butterfly-4694776.svg',
  'noun-crystal-3964625.svg',
  'noun-geometric-design-4806258.svg',
  'noun-geometric-form-1130277.svg',
  'noun-geometric-form-1130281.svg',
  'noun-geometric-form-1130364.svg',
  'noun-geometric-form-1130381.svg',
  'noun-geometric-whale-1514533.svg',
  'noun-halftone-striped-circles-4557080.svg',
  'noun-hippo-1411387.svg',
  'noun-humming-bird-4694768.svg',
  'noun-lines-geometric-pattern-6416204.svg',
  'noun-moon-phases-3819824.svg',
  'noun-optical-6416199.svg',
  'noun-polygon-2596313.svg',
  'noun-snail-66337.svg',
  'noun-spherical-striped-optical-geometric-shape-6416188.svg',
  'noun-striped-round-geometric-design-element-6416186.svg',
  'noun-wave-lines-6326958.svg',
]
