import { CardDemo } from '@/components/shadcn-ui-demo/card-demo'
import { ContextMenuDemo } from '@/components/shadcn-ui-demo/context-menu-demo'
import { NavigationMenuDemo } from '@/components/shadcn-ui-demo/main-nav'
import { SidebarDemo } from '@/components/shadcn-ui-demo/sidebar-demo'
import { TableDemo } from '@/components/shadcn-ui-demo/table-demo'
import { TabsDemo } from '@/components/shadcn-ui-demo/tabs-demo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function UiPage() {
  return (
    <div id="ui-page" className="min-h-full">
      {/* Header Bar */}
      <div
        id="ui-header"
        className="flex h-16 w-full flex-row items-center justify-between border-2 border-border bg-background px-8 text-foreground"
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">shadcn/ui</h1>
        <NavigationMenuDemo />
        <ThemeToggle />
      </div>

      {/* Content Area */}
      <div id="ui-content-area" className="flex flex-row justify-around gap-4 p-4">
        {/* Sidebar */}
        <SidebarDemo className="w-fit max-w-xs bg-background" />

        {/* Main Content */}
        <main className="border-2 border-border bg-background p-4 py-6">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Main Content Area</h3>

          <div className="mt-6 flex justify-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Ea voluptate proident fugiat fugiat sint voluptate elit. Ad qui nulla ut sint et sit
            ullamco qui. Veniam consequat sint deserunt qui adipisicing reprehenderit occaecat esse
            nostrud irure consectetur. Adipisicing veniam ullamco irure in enim. Enim laborum
            reprehenderit dolore nostrud excepteur veniam ad voluptate sunt enim.
          </p>

          <p className="prose mt-6">
            Ea voluptate proident fugiat fugiat sint voluptate elit. Ad qui nulla ut sint et sit
            ullamco qui. Veniam consequat sint deserunt qui adipisicing reprehenderit occaecat esse
            nostrud irure consectetur. Adipisicing veniam ullamco irure in enim. Enim laborum
            reprehenderit dolore nostrud excepteur veniam ad voluptate sunt enim.
          </p>

          <div className="flex flex-col items-center">
            <Separator className="my-4" />
            <TabsDemo />
            <Separator className="my-4" />
            <ContextMenuDemo />
            <Separator className="my-4" />
            <CardDemo />
            <Separator className="my-4" />
          </div>
          <TableDemo />
        </main>
      </div>
    </div>
  )
}
