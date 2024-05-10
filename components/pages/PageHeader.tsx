'use client'

import { SignInButton, UserButton } from '@clerk/nextjs'
import { IconButton } from '@radix-ui/themes'
import { Unauthenticated } from 'convex/react'
import { HomeIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useTitle } from 'react-use'

import { AppLogoTitle } from '@/components/ui/AppLogoTitle'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { useTwMediaQuery } from '@/lib/hooks'

const hideTextWhenTitleLength = 55

const useShowAppTitle = (titleLength = 0) => {
  const twSizes = useTwMediaQuery()
  if (twSizes.md) return true
  return titleLength < hideTextWhenTitleLength
}

export const PageHeader = ({
  icon,
  title,
  setPageTitle = true,
}: {
  icon?: React.ReactNode
  title?: string
  setPageTitle?: boolean
}) => {
  const showAppTitle = useShowAppTitle(title?.length)

  return (
    <header className="h-10 gap-0.5 border-b px-1 flex-between md:h-12 md:gap-2">
      {setPageTitle ? <DocumentTitle subtitle={title} /> : null}

      <AppLogoTitle showText={showAppTitle} />

      {(title || icon) && <div className="flex-none font-mono text-sm md:text-base">/</div>}
      {icon && <div className="flex-none [&>svg]:size-4 md:[&>svg]:size-5">{icon}</div>}

      {/* page title */}
      <h2 className="line-clamp-2 max-h-full grow font-mono text-sm tracking-tight md:text-base">
        {title}
      </h2>

      <div className="flex-none gap-2 flex-end">
        {/* quick nav */}
        <NonSecureAdminRoleOnly>
          <IconButton variant="ghost" asChild>
            <Link href="/">
              <HomeIcon />
            </Link>
          </IconButton>
        </NonSecureAdminRoleOnly>

        {/* user buttons */}
        <Unauthenticated>
          <SignInButton>
            <IconButton variant="surface" radius="large">
              <UserIcon />
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
  useTitle(title)
  return null
}
