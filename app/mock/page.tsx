import { CardDemo } from '@/components/card-demo'
import { NavigationMenuDemo } from '@/components/main-nav'
import { SidebarDemo } from '@/components/sidebar-demo'
import { TableDemo } from '@/components/table-demo'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function MockPage() {
  return (
    <div id="ui-page" className="bg-grid-teal min-h-full">
      {/* Header Bar */}
      <div
        id="ui-header"
        className="flex h-16 w-full flex-row items-center justify-between border-2 border-border bg-background px-8 text-foreground"
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          shadcn/ui
        </h1>
        <NavigationMenuDemo />
        <ThemeToggle />
      </div>

      {/* Content Area */}
      <div id="ui-content-area" className="flex flex-row justify-around gap-4 p-4">
        {/* Sidebar */}
        <SidebarDemo className="w-fit max-w-xs bg-background" />

        {/* Main Content */}
        <main className="border-2 border-border bg-background p-4 py-6">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Main Content Area <Button>buton</Button>
          </h3>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Ea voluptate proident fugiat fugiat sint voluptate elit. Ad qui nulla ut sint et sit
            ullamco qui. Veniam consequat sint deserunt qui adipisicing reprehenderit occaecat esse
            nostrud irure consectetur. Adipisicing veniam ullamco irure in enim. Enim laborum
            reprehenderit dolore nostrud excepteur veniam ad voluptate sunt enim.
          </p>
          <CardDemo className="float-right" />
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Qui laboris consequat est eu consequat ex tempor nostrud pariatur aliquip cupidatat ad
            eu. Excepteur nostrud laboris ea irure sint exercitation ad mollit ea deserunt. Laboris
            culpa aliqua exercitation officia. Dolor cillum elit cillum exercitation voluptate.
            Consequat sit ex magna mollit consequat. Esse ullamco duis aute laboris est laborum
            occaecat consectetur. Sunt sunt fugiat veniam magna dolore dolor esse in Lorem occaecat.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Anim commodo dolor ullamco tempor ut laborum. Enim ullamco elit incididunt deserunt
            mollit minim pariatur. Aliquip pariatur duis laboris sint est do anim exercitation ea
            amet est reprehenderit aute. Lorem incididunt amet eu non anim id irure nostrud ad
            officia elit veniam ex elit. In do aute reprehenderit exercitation quis elit ea
            incididunt occaecat exercitation proident.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Ut anim labore esse nisi. Veniam aliqua officia ipsum elit reprehenderit. Velit
            incididunt qui pariatur irure. Mollit amet consequat sit id consectetur veniam qui.
          </p>

          <TableDemo />
        </main>

        {/* Sidebar */}
        <SidebarDemo className="w-fit max-w-xs bg-background" />
      </div>
    </div>
  )
}
