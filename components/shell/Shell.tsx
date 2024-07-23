import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Badge, Button, Dialog, IconButton } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'

import { shellOpenAtom, shellSearchValueAtom } from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import { useShellStack } from '@/components/shell/hooks'
import { AppLogoName } from '@/components/ui/AppLogoName'
import * as Page from './pages'

export type ShellPage = keyof typeof Page

const Shell = () => {
  const [searchValue, setSearchValue] = useAtom(shellSearchValueAtom)

  const stack = useShellStack()

  return (
    <div className="flex h-full max-h-[55vh] flex-col sm:max-h-none">
      <div className="flex h-12 shrink-0 items-center justify-between gap-1 truncate border-b border-grayA-3 px-2 font-medium">
        <AppLogoName />
        <Badge>{stack.current}</Badge>
        <Button onClick={stack.pop}>Back</Button>
        <Button onClick={stack.clear}>Home</Button>
        <Dialog.Close>
          <IconButton variant="ghost" color="gray">
            <Icons.X className="size-5" />
          </IconButton>
        </Dialog.Close>
      </div>
      <CmdK>
        <CmdK.Input
          placeholder="Enter a command"
          value={searchValue}
          onValueChange={setSearchValue}
          autoFocus
          autoComplete="off"
        />
        <CmdK.List>
          <CmdK.Empty>No results found</CmdK.Empty>

          <CmdK.Item>{stack.current ?? 'Main Menu'}</CmdK.Item>
          {!stack.current && (
            <>
              <CmdK.Item onSelect={() => stack.push('UserThreads')}>Show Recent Threads</CmdK.Item>
              <CmdK.Item onSelect={() => stack.push('ModelPicker')}>Pick a Model</CmdK.Item>
            </>
          )}

          <Page.UserThreads />
          <Page.ModelPicker />
          <Page.ThreadConfig />
          <Page.EditThreadTitle />
        </CmdK.List>
      </CmdK>
    </div>
  )
}

const ShellDialog = ({ children, ...props }: React.ComponentProps<typeof Dialog.Root>) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger>
        <IconButton variant="surface">
          <Icons.TerminalWindow />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content
        align="start"
        maxWidth="42rem"
        className="rounded-md p-0"
        aria-describedby={undefined}
      >
        <Dialog.Title className="sr-only">Shell</Dialog.Title>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const ShellC = () => {
  const [open, setOpen] = useAtom(shellOpenAtom)

  useKeyboardEvent('i', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      setOpen(!open)
    }
  })
  return (
    <ShellDialog open={open} onOpenChange={setOpen}>
      <Shell />
    </ShellDialog>
  )
}
