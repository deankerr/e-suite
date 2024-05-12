'use client'

import { SignInButton, UserButton } from '@clerk/nextjs'
import { IconButton, Separator } from '@radix-ui/themes'
import { Unauthenticated } from 'convex/react'
import { UserIcon } from 'lucide-react'
import { useTitle } from 'react-use'

import { AppLogoTitle } from '@/components/ui/AppLogoTitle'
import { useViewer } from '@/lib/api'
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
      <header className="h-10 bg-gray-1 px-1 flex-between md:h-12 md:gap-2 md:px-3">
        {setPageTitle ? <DocumentTitle subtitle={title} /> : null}

        <AppLogoTitle showText={showAppTitle} />

        {(title || icon) && <div className="flex-none text-sm md:text-base">∕</div>}
        {icon && <div className="-mr-0.5 flex-none [&>svg]:size-4 md:[&>svg]:size-5">{icon}</div>}

        {/* page title */}
        <h2 className="line-clamp-2 max-h-full grow text-sm font-medium tracking-tight md:text-lg">
          {title}
        </h2>

        <div className="flex-none gap-2 flex-end">
          <ViewerInfo className="text-right font-mono text-xs text-gray-9" />
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

      <div>
        <Separator size="4" />
      </div>
    </>
  )
}

const ViewerInfo = (props: React.ComponentProps<'div'>) => {
  const { db, auth } = useViewer()
  return (
    <div {...props}>
      <div>
        {db?.name} {db?.role}/{auth.user?.publicMetadata?.role as string}{' '}
        {auth.isSignedIn ? '∴' : '∶'}
      </div>
      {db?.apiKey && (
        <div className="group">
          <span className="group-hover:hidden">api key</span>
          <span className="hidden group-hover:inline">{db.apiKey}</span>
        </div>
      )}
    </div>
  )
}

const DocumentTitle = ({ subtitle }: { subtitle?: string }) => {
  const title = `e/suite${subtitle ? ` / ${subtitle}` : ''}`
  useTitle(title)
  return null
}
