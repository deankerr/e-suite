import NextImage from 'next/image'

import BarsFlash from '@/assets/bars-flash.svg'
import BarsProgress from '@/assets/bars-progress.svg'
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
        'absolute inset-0 grid h-screen place-content-center p-8 transition-all duration-1000 bg-sun-large-[#331E0B] *:opacity-30',
        alert && 'from-red-2 *:-hue-rotate-[30deg] *:saturate-[1.2]',
      )}
    >
      <div className="fixed inset-x-1/4 bottom-0 h-16">
        <NextImage
          unoptimized
          src={alert ? BarsFlash : BarsProgress}
          alt=""
          className={cn('', hideBars && 'hidden')}
          fill
        />
      </div>
    </div>
  )
}
