import { Button, Card, Heading, Slider, Switch } from '@radix-ui/themes'
import { SidebarToggleDemo } from './SidebarToggle'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div className="sidebar-grid grid h-dvh grid-cols-[theme(spacing.16)_auto] grid-rows-[auto_var(--space-6)] transition-all">
      {/* sidebar */}
      <div className="sidebar border-gray-5 border-r">
        <div className="border-gray-2 grid h-[var(--space-8)] place-content-center border-b">
          <Heading size="6" className="text-accent">
            e/drop
          </Heading>
        </div>
        nav
      </div>

      {/* content grid */}
      <div className="grid grid-rows-[var(--space-8)_auto]">
        {/* header */}
        <div className="border-gray-5 flex gap-2 border-b">
          <SidebarToggleDemo />
          Header
          <div className="bg-red-4 w-rx-9">a</div>
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
      <div className="border-gray-5 col-span-2 flex items-center border-t">Footer</div>
    </div>
  )
}
