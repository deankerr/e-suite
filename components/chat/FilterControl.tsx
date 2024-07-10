import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label } from '@radix-ui/react-label'
import { Button, Checkbox, Popover, Radio, Separator } from '@radix-ui/themes'

import { useChatState } from '@/lib/atoms'

export const FilterControl = (props: { slug: string }) => {
  const [chatState, setChatState] = useChatState(props.slug)

  const className =
    'flex items-center py-1 rounded-md pl-1.5 pr-4 cursor-pointer hover:bg-grayA-2 shrink-0'

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline" size="2" color={chatState.queryFilters ? 'orange' : 'gray'}>
          <Icons.FunnelSimple className="size-5" />
          Filter
        </Button>
      </Popover.Trigger>

      <Popover.Content size="1" className="px-1.5 py-2 text-sm">
        <div className="flex flex-col">
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

          <Label className={className}>
            <Radio
              value="images"
              className="mr-2"
              checked={chatState.queryFilters?.hasContent === 'image'}
              onClick={() => {
                setChatState((state) => {
                  state.queryFilters = {
                    hasContent: 'image',
                  }
                })
              }}
            />
            <Icons.Images className="mr-1 size-4" />
            <span className="font-medium">Images</span>
          </Label>

          <Label className={className}>
            <Radio
              value="audio"
              className="mr-2"
              checked={chatState.queryFilters?.hasContent === 'audio'}
              onClick={() => {
                setChatState((state) => {
                  state.queryFilters = {
                    hasContent: 'audio',
                    role: undefined,
                  }
                })
              }}
            />
            <Icons.CassetteTape className="mr-1 size-4" />
            <span className="font-medium">Audio</span>
          </Label>

          <Separator size="4" my="1" />

          <div className="grid grid-cols-2">
            <Label className={className}>
              <Checkbox
                className="mr-2"
                checked={chatState.queryFilters?.role === 'assistant'}
                onCheckedChange={(checked) => {
                  setChatState((state) => {
                    state.queryFilters = {
                      ...state.queryFilters,
                      role: checked ? 'assistant' : undefined,
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
                checked={chatState.queryFilters?.role === 'user'}
                onCheckedChange={(checked) => {
                  setChatState((state) => {
                    state.queryFilters = {
                      ...state.queryFilters,
                      role: checked ? 'user' : undefined,
                    }
                  })
                }}
              />
              <Icons.User className="mr-1 size-4" />
              User
            </Label>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}
