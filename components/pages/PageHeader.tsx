import { SignInButton, UserButton } from '@clerk/nextjs'
import { IconButton } from '@radix-ui/themes'
import { useDocumentTitle } from '@uidotdev/usehooks'
import { Authenticated, Unauthenticated } from 'convex/react'
import { BaselineIcon, HomeIcon, ImagesIcon, UserIcon } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'

import LogoSunset from '@/assets/logo-sunset.svg'

export const PageHeader = ({
  icon,
  title,
  setPageTitle = true,
}: {
  icon?: React.ReactNode
  title?: string
  setPageTitle?: boolean
}) => {
  return (
    <header className="h-12 gap-2 border-b px-1 flex-between">
      {/* logo / page titles */}
      {setPageTitle ? <DocumentTitle subtitle={title} /> : null}
      <Link href="/" className="shrink-0 gap-1 flex-start">
        <div className="gap-1 flex-start">
          <NextImage src={LogoSunset} alt="" className="size-7 shrink-0" priority unoptimized />
          <h1 className="text-lg font-semibold tracking-tight">e/suite</h1>
        </div>
      </Link>

      <div className="flex-none font-mono">/</div>
      <h2 className="line-clamp-2 max-h-full grow gap-2 font-mono tracking-tight [&>svg]:mr-1.5 [&>svg]:inline">
        {icon}
        {title}
      </h2>

      <div className="shrink-0 gap-2 flex-end">
        {/* quick nav */}
        <Authenticated>
          <IconButton variant="ghost" asChild>
            <Link href="/dev/basic">
              <BaselineIcon className="stroke-[1.5]" />
            </Link>
          </IconButton>
          <IconButton variant="ghost" asChild>
            <Link href="/">
              <HomeIcon className="stroke-[1.5]" />
            </Link>
          </IconButton>

          <IconButton variant="ghost" asChild>
            <Link href="/image-feed">
              <ImagesIcon className="stroke-[1.5]" />
            </Link>
          </IconButton>
        </Authenticated>

        {/* user buttons */}
        <Unauthenticated>
          <SignInButton>
            <IconButton variant="surface" radius="large">
              <UserIcon className="stroke-[1.5]" />
            </IconButton>
          </SignInButton>
        </Unauthenticated>

        <UserButton />
      </div>
    </header>
  )
}

const DocumentTitle = ({ subtitle }: { subtitle?: string }) => {
  const title = `e/suite${subtitle ? ` / ${subtitle}` : ''}`
  useDocumentTitle(title)
  return null
}
