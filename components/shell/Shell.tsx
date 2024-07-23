import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Code, Dialog, IconButton } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'

import { shellOpenAtom, shellSearchValueAtom } from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import { useShellStack, useShellUserThreads } from '@/components/shell/hooks'
import { AppLogoName } from '@/components/ui/AppLogoName'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import * as Page from './pages'

export type ShellPage = keyof typeof Page

const Shell = () => {
  const [searchValue, setSearchValue] = useAtom(shellSearchValueAtom)

  const stack = useShellStack()

  return (
    <div className="flex h-full max-h-[55vh] flex-col sm:max-h-none">
      <div className="flex h-12 shrink-0 items-center justify-between gap-1 truncate border-b border-grayA-3 px-2 font-medium">
        <ShellTitle />

        <div className="flex-end shrink-0 gap-1">
          <Dialog.Close>
            <IconButton variant="ghost" color="gray" className="m-0">
              <Icons.X className="phosphor" />
            </IconButton>
          </Dialog.Close>
        </div>
      </div>

      <CmdK tabIndex={0}>
        {!stack.current || stack.current === 'ModelPicker' ? (
          <CmdK.Input
            placeholder="Enter a command"
            value={searchValue}
            onValueChange={setSearchValue}
            autoFocus
            autoComplete="off"
          />
        ) : null}
        <CmdK.List>
          <CmdK.Empty>No results found</CmdK.Empty>

          <Page.UserThreads />
          <Page.ModelPicker />
          <Page.ThreadConfig />
          <Page.EditThreadTitle />
          <Page.DeleteThread />

          <AdminOnlyUi>
            <Code size="1" color="gray" className="absolute -top-1 right-0 opacity-50">
              {stack.current ?? 'none'}
            </Code>
          </AdminOnlyUi>
        </CmdK.List>
      </CmdK>
    </div>
  )
}

const pageTitles: Record<string, string> = {
  ThreadConfig: 'Thread: %t',
  EditThreadTitle: 'Edit Title',
  DeleteThread: 'Delete Thread',
  ModelPicker: 'Select Model',
  UserThreads: 'Threads',
} satisfies Record<ShellPage, string>

const ShellTitle = () => {
  const stack = useShellStack()
  const threads = useShellUserThreads()

  let title = pageTitles[stack.current ?? ''] ?? stack.current ?? ''
  title = title.replace('%t', threads.current?.title ?? 'untitled thread')

  if (!title) {
    return <AppLogoName className="ml-1" />
  }

  return (
    <>
      <IconButton variant="ghost" color="gray" className="m-0 shrink-0" onClick={stack.pop}>
        <Icons.CaretLeft className="phosphor" />
      </IconButton>
      <div className="grow truncate">{title}</div>
    </>
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
