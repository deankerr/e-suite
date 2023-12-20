import logo from '/assets/icons/logo-sunset.svg'
import Image from 'next/image'

type LogoProps = {
  props?: any
}
export const Logo = ({ props }: LogoProps) => {
  return (
    <div className={'flex items-center'}>
      <Image src={logo} alt="e/suite logo" className="w-12" priority />
      <h1 className="pl-2 pr-2.5 text-xl font-semibold tracking-tight">e/suite</h1>
    </div>
  )
}
