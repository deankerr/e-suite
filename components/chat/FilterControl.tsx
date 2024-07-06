import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label } from '@radix-ui/react-label'
import { Button, Checkbox, Popover, Radio, Separator } from '@radix-ui/themes'

import { useChatState } from '@/lib/atoms'

const defaultFilters = {
  role: 'any' as const,
  image: false,
  audio: false,
}

export const FilterControl = (props: { slug: string }) => {
  const [chatState, setChatState] = useChatState(props.slug)
  const filters = chatState.queryFilters ?? defaultFilters

  const className = 'flex items-center py-2 rounded-md pl-1.5 pr-4 cursor-pointer hover:bg-grayA-2'
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline" size="2" color={chatState.queryFilters ? 'orange' : 'gray'}>
          <Icons.FunnelSimple className="size-5" />
          Filter
        </Button>
      </Popover.Trigger>

      <Popover.Content size="1" className="px-1.5 py-2 text-sm">
        <div className="flex flex-col gap-1">
          <Label className={className}>
            <Radio
              value="all"
              className="mr-2"
              checked={!chatState.queryFilters}
              onClick={() => {
                setChatState((state) => {
                  state.queryFilters = undefined
                })
              }}
            />
            <span className="font-medium">All</span>
          </Label>

          <Separator size="4" my="1" />

          <Label className={className}>
            <Checkbox
              className="mr-2"
              checked={filters.image}
              onCheckedChange={(checked) => {
                setChatState((state) => {
                  state.queryFilters = {
                    ...filters,
                    image: Boolean(checked),
                  }
                })
              }}
            />
            <Icons.Images className="mr-1 size-4" />
            Images
          </Label>
          <Label className={className}>
            <Checkbox
              className="mr-2"
              checked={filters.audio}
              onCheckedChange={(checked) => {
                setChatState((state) => {
                  state.queryFilters = {
                    ...filters,
                    audio: Boolean(checked),
                  }
                })
              }}
            />
            <Icons.CassetteTape className="mr-1 size-4" />
            Audio
          </Label>

          <Separator size="4" my="1" />

          <Label className={className}>
            <Checkbox
              className="mr-2"
              checked={filters.role === 'ai'}
              onCheckedChange={(checked) => {
                setChatState((state) => {
                  state.queryFilters = {
                    ...filters,
                    role: checked ? 'ai' : 'any',
                  }
                })
              }}
            />
            <Icons.Robot className="mr-1 size-4" />
            AI
          </Label>
          <Label className={className}>
            <Checkbox
              className="mr-2"
              disabled
              // checked={filters.role.user}
              // onCheckedChange={(checked) => {
              //   setChatState((state) => {
              //     state.filter.role.user = Boolean(checked)
              //   })
              // }}
            />
            <Icons.User className="mr-1 size-4" />
            User
          </Label>
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}
