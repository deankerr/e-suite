/* eslint-disable react/no-unescaped-entities */
import { CardDemo } from '@/components/shadcn-ui-demo/card-demo'
import { ContextMenuDemo } from '@/components/shadcn-ui-demo/context-menu-demo'
import { NavigationMenuDemo } from '@/components/shadcn-ui-demo/main-nav'
import { SidebarDemo } from '@/components/shadcn-ui-demo/sidebar-demo'
import { TableDemo } from '@/components/shadcn-ui-demo/table-demo'
import { TabsDemo } from '@/components/shadcn-ui-demo/tabs-demo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { TypographyDemo } from './typography'

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
        <SidebarDemo className="max-w-[16rem] bg-background" />

        {/* Main Content */}
        <main className="grow border-2 border-border bg-background p-4 py-6">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Main Content Area</h3>

          <div className="my-6 flex justify-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>

          <Separator />

          {/* Palette */}
          <div className="my-6 w-96 space-x-2 border border-black">
            {[
              'background',
              'foreground',
              'card',
              'card-foreground',
              'popover',
              'popover-foreground',
              'primary',
              'primary-foreground',
              'secondary',
              'secondary-foreground',
              'muted',
              'muted-foreground',
              'accent',
              'accent-foreground',
              'destructive',
              'destructive-foreground',
              'border',
              'input',
              'ring',
            ].map((val) => {
              return (
                <div className="flex" key={val}>
                  <div className="text-right">{val}</div>
                  <div style={{ backgroundColor: `hsl(var(--${val}))` }}>{val}</div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border p-6 pt-10">
              <article className="mx-auto max-w-2xl">
                <TypographyDemo />
              </article>
            </div>

            <div className="border p-6 pt-10">
              <article className="prose mx-auto dark:prose-invert">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  The Joke Tax Chronicles
                </h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  Once upon a time, in a far-off land, there was a very lazy king who spent all day
                  lounging on his throne. One day, his advisors came to him with a problem: the
                  kingdom was running out of money.
                </p>
                <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  The King's Plan
                </h2>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  The king thought long and hard, and finally came up with{' '}
                  <a href="#" className="font-medium text-primary underline underline-offset-4">
                    a brilliant plan
                  </a>
                  : he would tax the jokes in the kingdom.
                </p>
                <blockquote className="mt-6 border-l-2 pl-6 italic">
                  "After all," he said, "everyone enjoys a good joke, so it's only fair that they
                  should pay for the privilege."
                </blockquote>
                <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                  The Joke Tax
                </h3>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  The king's subjects were not amused. They grumbled and complained, but the king
                  was firm:
                </p>
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                  <li>1st level of puns: 5 gold coins</li>
                  <li>2nd level of jokes: 10 gold coins</li>
                  <li>3rd level of one-liners : 20 gold coins</li>
                </ul>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  As a result, people stopped telling jokes, and the kingdom fell into a gloom. But
                  there was one person who refused to let the king's foolishness get him down: a
                  court jester named Jokester.
                </p>
                <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                  Jokester's Revolt
                </h3>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  Jokester began sneaking into the castle in the middle of the night and leaving
                  jokes all over the place: under the king's pillow, in his soup, even in the royal
                  toilet. The king was furious, but he couldn't seem to stop Jokester.
                </p>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  And then, one day, the people of the kingdom discovered that the jokes left by
                  Jokester were so funny that they couldn't help but laugh. And once they started
                  laughing, they couldn't stop.
                </p>
                <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                  The People's Rebellion
                </h3>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  The people of the kingdom, feeling uplifted by the laughter, started to tell jokes
                  and puns again, and soon the entire kingdom was in on the joke.
                </p>
                <div className="my-6 w-full overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                          King's Treasury
                        </th>
                        <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                          People's happiness
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          Empty
                        </td>
                        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          Overflowing
                        </td>
                      </tr>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          Modest
                        </td>
                        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          Satisfied
                        </td>
                      </tr>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          Full
                        </td>
                        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          Ecstatic
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  The king, seeing how much happier his subjects were, realized the error of his
                  ways and repealed the joke tax. Jokester was declared a hero, and the kingdom
                  lived happily ever after.
                </p>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  The moral of the story is: never underestimate the power of a good laugh and
                  always be careful of bad ideas.
                </p>
              </article>
            </div>
          </div>
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
          <article className="prose">
            <h1>The Truest Test</h1>
            <p>
              Ea voluptate proident fugiat fugiat sint voluptate elit. Ad qui nulla ut sint et sit
              ullamco qui. Veniam consequat sint deserunt qui adipisicing reprehenderit occaecat
              esse nostrud irure consectetur. Adipisicing veniam ullamco irure in enim. Enim laborum
              reprehenderit dolore nostrud excepteur veniam ad voluptate sunt enim.
            </p>
            <h2>Cillum culpa do aliqua sunt laborum velit.</h2>
            <p>
              Fugiat esse enim laboris quis aliquip fugiat laboris deserunt cillum ad excepteur
              mollit veniam eu. Incididunt nisi ipsum quis minim mollit occaecat officia. Anim qui
              aliquip tempor. Excepteur ut magna ex culpa adipisicing laborum incididunt pariatur
              sint exercitation amet mollit incididunt nisi amet. Pariatur ut dolor ullamco veniam.
              Esse ipsum aliquip eu ad qui adipisicing sit ut eiusmod sint magna cupidatat et duis.
              Occaecat eiusmod Lorem incididunt fugiat amet eiusmod Lorem. Anim velit officia
              laborum nostrud aliquip et dolor nostrud nostrud incididunt. Exercitation enim tempor
              cillum qui amet sunt sunt. Eiusmod reprehenderit adipisicing laboris enim sit.
            </p>
            <p>
              Nostrud excepteur cupidatat eu quis cillum fugiat ipsum ea nostrud laborum eu esse
              pariatur aute. Adipisicing excepteur sit dolor aliquip aliquip anim veniam aliquip qui
              cupidatat quis. Anim non veniam qui aliqua cupidatat laboris et do. Incididunt esse eu
              quis ipsum velit aliquip aliqua do. Anim cupidatat irure fugiat cupidatat eu mollit
              proident magna Lorem.
            </p>
          </article>
        </main>
      </div>
    </div>
  )
}
