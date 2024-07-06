import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label } from '@radix-ui/react-label'
import { Button, Checkbox, Popover, Radio, Separator } from '@radix-ui/themes'

export const FilterControl = () => {
  const className = 'flex items-center py-2 rounded-md pl-1.5 pr-4 cursor-pointer hover:bg-grayA-2'

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline" size="2" color="gray">
          <Icons.FunnelSimple className="size-5" />
          Filter
        </Button>
      </Popover.Trigger>

      <Popover.Content size="1" className="px-1.5 py-2 text-sm">
        <div className="flex flex-col gap-1">
          <Label className={className}>
            <Radio value="all" className="mr-2" />
            <span className="font-medium">All</span>
          </Label>

          <Separator size="4" my="1" />

          <Label className={className}>
            <Checkbox className="mr-2" />
            <Icons.Images className="mr-1 size-4" />
            Images
          </Label>
          <Label className={className}>
            <Checkbox className="mr-2" />
            <Icons.CassetteTape className="mr-1 size-4" />
            Audio
          </Label>

          <Separator size="4" my="1" />

          <Label className={className}>
            <Checkbox className="mr-2" />
            <Icons.User className="mr-1 size-4" />
            User
          </Label>
          <Label className={className}>
            <Checkbox className="mr-2" />
            <Icons.Robot className="mr-1 size-4" />
            AI
          </Label>
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}
