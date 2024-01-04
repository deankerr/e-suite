import { Card } from '@radix-ui/themes'

type LeftBarProps = {
  props?: any
}

export const LeftBar = ({ props }: LeftBarProps) => {
  return (
    <div className="left-sidebar border-r border-gray-6 [&_div]:hover:flex">
      <div className="hidden flex-col gap-6 p-4">
        <Card size="2">
          Session Info
          <div className="text-sm">Data should go here e/dropper</div>
        </Card>
        <Card size="2">
          History
          <div className="text-sm">Data should go here e/dropper</div>
        </Card>
        <Card size="2">
          Saved
          <div className="text-sm">Data should go here e/dropper</div>
        </Card>
        <Card size="2">
          Templates
          <div className="text-sm">Data should go here e/dropper</div>
        </Card>

        <Card size="2">
          Thumbnails
          <div className="text-sm">Data should go here e/dropper</div>
        </Card>

        <Card size="2">
          Download
          <div className="text-sm">Data should go here e/dropper</div>
        </Card>
      </div>
    </div>
  )
}
