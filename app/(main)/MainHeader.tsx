import { UserButton } from '@clerk/nextjs'
import { Heading, IconButton } from '@radix-ui/themes'
import {
  ChevronLeftIcon,
  MessageSquareIcon,
  MessagesSquareIcon,
  SquareActivityIcon,
  SquirrelIcon,
} from 'lucide-react'
import Link from 'next/link'

export const MainHeader = ({ segments }: { segments: string[] }) => {
  const [ent] = segments
  const title = ent === 'dashboard' ? ent : ent === 'm' ? 'message' : ent === 't' ? 'thread' : '?'

  const routeIcons: Record<string, React.ReactNode> = {
    m: <MessageSquareIcon className="stroke-[1.5]" />,
    t: <MessagesSquareIcon className="stroke-[1.5]" />,
    dashboard: <SquareActivityIcon />,
  }

  const icon = routeIcons[ent ?? ''] ?? <SquirrelIcon />

  return (
    <header className="grid h-14 grid-cols-2 border-b border-gold-6 px-2">
      {/* title */}
      <div className="flex items-center gap-2">
        <IconButton variant="ghost" asChild>
          <Link href={'/dashboard'}>
            <ChevronLeftIcon className="stroke-[1.5] text-gray-11" />
          </Link>
        </IconButton>

        {icon}
        <Heading size="5">{title}</Heading>
      </div>

      <div className="flex items-center justify-end gap-2 pr-2">
        <UserButton />
      </div>
    </header>
  )
}
