'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Badge, Button, Callout, IconButton } from '@radix-ui/themes'
import { accentColors } from '@radix-ui/themes/props'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'

export default function Page() {
  return (
    <AdminPageWrapper>
      <div className="flex flex-wrap gap-3 bg-grayA-2 p-2">
        {accentColors.map((color) => (
          <Badge key={color} size="3" color={color}>
            {color}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 bg-grayA-2 p-2">
        <Button variant="solid">Accent</Button>
        <Button variant="surface">Accent</Button>
        <Button variant="outline">Accent</Button>
        <Button variant="soft">Accent</Button>

        <IconButton variant="solid">
          <Icons.Chat />
        </IconButton>
        <IconButton variant="surface">
          <Icons.Chat />
        </IconButton>
        <IconButton variant="outline">
          <Icons.Chat />
        </IconButton>
        <IconButton variant="soft">
          <Icons.Chat />
        </IconButton>
      </div>

      <div className="flex flex-wrap gap-3 bg-grayA-2 p-2">
        <Callout.Root>
          Sit consequat incididunt sit laborum qui et cillum proident dolore et nulla. Lorem qui
          sunt in. Commodo amet quis non veniam ullamco. Consequat nulla ex nostrud ut anim ad enim.
          Lorem occaecat pariatur proident tempor. Aliqua ad laborum cupidatat irure officia amet
          nisi id. Ullamco eiusmod anim officia culpa amet consequat. Voluptate reprehenderit
          excepteur sunt cillum aute laboris consectetur id ex anim laborum.
        </Callout.Root>
      </div>
    </AdminPageWrapper>
  )
}
