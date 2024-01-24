import { Shell } from '@/app/components/ui/Shell'
import { Button } from '@radix-ui/themes'

export default function Page() {
  // Page

  return (
    <div className="grid place-content-center">
      <Shell.Root>
        <Shell.TitleBar>New Shell</Shell.TitleBar>
        <Shell.Controls>
          <Button variant='outline' color='amber'>Demo</Button>
          <Button variant='outline'>Demo</Button>
          <Button variant='outline' color='red'>Demo</Button>
        </Shell.Controls>

        <Shell.Content>
          Aute veniam qui dolore aliquip. Elit minim minim nulla incididunt nulla nulla cillum nulla
          non. Irure id veniam nisi proident incididunt incididunt non ea ex elit irure. Voluptate
          dolore do cillum magna ad elit reprehenderit id reprehenderit cupidatat.
        </Shell.Content>

        <Shell.Sidebar>Sidebar</Shell.Sidebar>
      </Shell.Root>
    </div>
  )
}
