'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Badge, BadgeProps, Card, Heading } from '@radix-ui/themes'
import { accentColors } from '@radix-ui/themes/props'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { useCachedQuery } from '@/app/lib/api/helpers'
import { useChatModels } from '@/app/lib/api/models'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { api } from '@/convex/_generated/api'

export default function Page() {
  const events = useCachedQuery(api.db.admin.events.latest, { limit: 100 })
  const chatModels = useChatModels()

  return (
    <AdminPageWrapper className="space-y-4">
      <div className="flex flex-wrap gap-3 bg-grayA-2 p-2">
        {accentColors.map((color) => (
          <Badge key={color} size="3" color={color}>
            {color}
          </Badge>
        ))}
      </div>

      <Card className="max-w-2xl">
        <Heading size="5" className="flex items-center gap-2">
          <Icons.Info className="size-6" />
          Models
        </Heading>

        <div className="flex-start gap-2">
          <div className="flex gap-1 py-2">
            <Badge color="green">Chat</Badge>
            <div className="text-sm">{chatModels?.length ?? '...'}</div>
          </div>
        </div>
      </Card>

      <Card className="max-w-2xl">
        <Heading size="5" className="flex items-center gap-2">
          <Icons.Info className="size-6" />
          Events
        </Heading>

        <VScrollArea>
          <div className="divide-y">
            {events?.map((event) => (
              <div key={event._id}>
                <div className="flex gap-1 py-2">
                  <div className="w-20 shrink-0 text-xs" suppressHydrationWarning>
                    {new Date(event._creationTime).toLocaleString()}
                  </div>

                  <Badge color={eventTypeColors[event.type]}>{event.type}</Badge>

                  <div className="text-sm">{event.message}</div>
                </div>
                {event.data ? (
                  <pre className="flex-none overflow-x-auto whitespace-pre-wrap p-2 text-xs">
                    {JSON.stringify(
                      { before: event.data.before, after: event.data.after },
                      null,
                      2,
                    ).slice(2, -2)}
                  </pre>
                ) : null}
              </div>
            ))}
          </div>
        </VScrollArea>
      </Card>
    </AdminPageWrapper>
  )
}

const eventTypeColors: Record<string, BadgeProps['color']> = {
  error: 'red',
  warning: 'yellow',
  notice: 'blue',
  info: 'green',
  debug: 'gray',
}
