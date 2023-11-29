import sunStripe from '@/assets/icons/sun-stripe.svg'
import Image from 'next/image'

export default async function AppLandingPage() {
  return (
    <div className="flex h-full w-full items-center justify-center p-10">
      <div className="relative h-5/6 w-5/6">
        <Image src={sunStripe} alt="sun" fill className="z-0 opacity-50" priority />
      </div>
    </div>
  )
}
