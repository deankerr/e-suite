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
        'absolute inset-0 h-screen bg-gradient-radial from-orange-2 to-[84%] transition-all duration-1000 *:opacity-30',
        alert && 'from-red-2 *:-hue-rotate-[30deg] *:saturate-[1.2]',
      )}
    >
      <div className={cn('mx-auto grid h-full w-2/3 grid-rows-3')}>
        <div></div>
        <div className="flex-center">
          <NextImage unoptimized alt="loading" src={SunLarge} width={500} height={500} />
        </div>
        <div className="items-end py-2 flex-center">
          <NextImage
            src={alert ? BarsFlash : BarsProgress}
            alt=""
            className={cn('', hideBars && 'hidden')}
            width={500}
            height={100}
          />
        </div>
      </div>
    </div>
  )
}
// #F9F9FB #FFFFFF
