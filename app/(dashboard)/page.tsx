import sunStripe from '@/assets/icons/sun-stripe.svg'
import Image from 'next/image'

export default async function AppLandingPage() {
  return (
    <div className="relative grid h-full w-full place-content-center">
      <Image src={sunStripe} alt="sun" fill className="z-0 opacity-10" priority />
    </div>
  )
}
