import NextImage from 'next/image'

import BarsFlash from '@/assets/bars-flash.svg'
import BarsProgress from '@/assets/bars-progress.svg'
import SunLarge from '@/assets/sun-large.svg'
import { cn } from '@/lib/utils'

export const SunBarLoader = ({
  alert = false,
  hideBars = false,
}: {
  alert?: boolean
  hideBars?: boolean
}) => {
  return (
    <div
      className={cn(
        'bg-gradient-radial absolute inset-0 from-orange-3 to-[84%] transition-all duration-1000 *:opacity-40',
        alert && 'from-red-3 *:-hue-rotate-[30deg] *:saturate-[1.2]',
      )}
    >
      <div className={cn('mx-auto grid h-full w-2/3 grid-rows-3')}>
        <div></div>
        <div className="flex-center">
          <NextImage src={SunLarge} alt="" className="h-[125%]" width={500} height={500} priority />
        </div>
        <div className="flex-center items-end py-2">
          <NextImage
            src={alert ? BarsFlash : BarsProgress}
            alt=""
            className={cn('h-[20%]', hideBars && 'hidden')}
            width={500}
            height={100}
          />
        </div>
      </div>
    </div>
  )
}
