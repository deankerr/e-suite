import { UserButton } from '@clerk/nextjs'
import { Heading, IconButton } from '@radix-ui/themes'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

type PageHeaderProps = { icon?: React.ReactNode; title: string; backNav?: string }

export const PageHeader = ({ backNav, icon, title }: PageHeaderProps) => {
  return (
    <header className="mx-2 flex h-14 items-center border-b border-gold-6">
      <div className="shrink-0 gap-2 flex-start">
        {backNav ? (
          <IconButton variant="ghost" asChild>
            <Link href={backNav}>
              <ChevronLeftIcon className="stroke-[1.5] text-gray-11" />
            </Link>
          </IconButton>
        ) : (
          <IconButton variant="ghost" className="invisible" disabled>
            <ChevronLeftIcon className="stroke-[1.5] text-gray-11" />
          </IconButton>
        )}

        <div>{icon}</div>
      </div>

      <Heading size="4" className="grow truncate px-2">
        {title}
      </Heading>

      <div className="flex shrink-0 items-center px-2">
        <UserButton />
      </div>
    </header>
  )
}
