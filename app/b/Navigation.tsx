import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'
import Link from 'next/link'

import { ChatNavList } from '@/app/b/_components/ChatNavList'
import { appConfig } from '@/app/b/config'
import { UserButtons } from '@/components/layout/UserButtons'
import { AppLogoName } from '@/components/ui/AppLogoName'
import { cn } from '@/lib/utils'

export const Navigation = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('fixed inset-y-0 w-56 p-1.5', className)}>
      <nav className="flex h-full flex-col overflow-hidden rounded-md border border-transparent">
        {/* * logo / menu button * */}
        <div className="flex h-12 shrink-0 items-center justify-between px-1.5">
          <Link href={appConfig.baseUrl}>
            <AppLogoName />
          </Link>

          <IconButton variant="ghost" size="1" className="shrink-0">
            <Icons.List className="size-6" />
          </IconButton>
        </div>

        {/* * compose * */}
        <div className="flex h-12 shrink-0 justify-center py-2">
          <Button variant="surface" radius="small">
            <Icons.Feather weight="light" className="size-5" />
            Compose
          </Button>
        </div>

        {/* * chats * */}
        <ChatNavList />

        {/* * footer * */}
        <div className="flex h-12 shrink-0 items-center justify-center border-t border-grayA-3 px-3">
          <UserButtons />
        </div>
      </nav>
    </div>
  )
}
