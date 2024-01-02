import { Button, Card, Heading, IconButton, Slider, Switch } from '@radix-ui/themes'
import { SidebarIcon } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div className="grid h-dvh grid-cols-[calc(240px_*_var(--scaling))_auto] grid-rows-[auto_var(--space-6)] duration-300 has-[first-child:hover]:grid-cols-[64px_auto]">
      {/* sidebar */}
      <div className="border-r border-gray-5">
        <div className="grid h-[var(--space-8)] place-content-center border-b border-gray-2">
          <Heading size="6" className="text-accent">
            e/drop
          </Heading>
        </div>
        nav
      </div>

      {/* content grid */}
      <div className="grid grid-rows-[var(--space-8)_auto]">
        {/* header */}
        <div className="border-b border-gray-5">
          header
          <IconButton className="bg-white">
            <SidebarIcon />
          </IconButton>
        </div>
        {/* content */}
        <div className="">
          <Card>
            Welcome! <Switch />
            <br />
            <Button>RADIX</Button>
            <br />
            <br />
            <Slider defaultValue={[50]} />
          </Card>
        </div>
      </div>

      {/* footer */}
      <div className="col-span-2 flex items-center border-t border-gray-5">Footer</div>
    </div>
  )
}
