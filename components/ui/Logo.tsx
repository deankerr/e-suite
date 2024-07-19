import Image from 'next/image'

import LogoSvg from '@/assets/logo32.svg'

export const Logo = (props: Partial<React.ComponentProps<typeof Image>>) => {
  return <Image src={LogoSvg} alt="logo" priority unoptimized {...props} />
}
