import NextImage from 'next/image'

import BarsFlash from '@/assets/bars-flash.svg'
import BarsProgress from '@/assets/bars-progress.svg'
import SunLarge from '@/assets/sun-large.svg'
import { cn } from '@/lib/utils'

export const SunBarLoader = ({ alert = false }: { alert?: boolean }) => {
  return (
    <div
      className={cn(
        'flex-col-center absolute inset-0 bg-accent-1 p-10 pb-4 transition-all duration-1000 *:opacity-60',
        alert && 'bg-red-2 -hue-rotate-[30deg] saturate-[1.5]',
      )}
    >
      <NextImage src={SunLarge} alt="" className="grow" priority />
      <NextImage src={alert ? BarsFlash : BarsProgress} alt="" className="px-10" />
    </div>
  )
}
