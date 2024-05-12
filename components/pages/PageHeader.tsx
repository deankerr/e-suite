'use client'

import { SignInButton, UserButton } from '@clerk/nextjs'
import { IconButton, Separator } from '@radix-ui/themes'
import { Unauthenticated } from 'convex/react'
import { UserIcon } from 'lucide-react'
import { useTitle } from 'react-use'

import { AppLogoTitle } from '@/components/ui/AppLogoTitle'
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
    <>
      <header className="h-10 px-1 flex-between md:h-12 md:gap-2 md:px-5">
        {setPageTitle ? <DocumentTitle subtitle={title} /> : null}

        <AppLogoTitle showText={showAppTitle} />

        {(title || icon) && <div className="flex-none text-sm md:text-base">/</div>}
        {icon && <div className="-mr-0.5 flex-none [&>svg]:size-4 md:[&>svg]:size-5">{icon}</div>}

        {/* page title */}
        <h2 className="line-clamp-2 max-h-full grow text-sm font-medium tracking-tight md:text-lg">
          {title}
        </h2>

        <div className="flex-none gap-2 flex-end">
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

      <div className="px-1 md:px-4">
        <Separator size="4" />
      </div>
    </>
  )
}

const DocumentTitle = ({ subtitle }: { subtitle?: string }) => {
  const title = `e/suite${subtitle ? ` / ${subtitle}` : ''}`
  useTitle(title)
  return null
}
