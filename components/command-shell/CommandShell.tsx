'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Dialog } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'
import Link from 'next/link'

import {
  Cmdk,
  CmdkEmpty,
  CmdkGroup,
  CmdkInput,
  CmdkItem,
  CmdkList,
  CmdkSeparator,
} from '@/components/command-shell/components/Cmdk'
import { useCommandShell } from '@/components/command-shell/useCommandShell'
import { AppLogoName } from '@/components/ui/AppLogoName'
import { commandShellOpenAtom } from '@/lib/atoms'

const CommandShellMenu = () => {
  const { threads, closeDialog } = useCommandShell()
  return (
    <div className="flex h-full max-h-[55vh] flex-col sm:max-h-none">
      {/* * header * */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-grayA-3 px-3">
        <AppLogoName />
        <div className="ml-auto font-mono text-xs text-gray-11">Command Shell</div>
      </div>

      {/* * menu * */}
      <Cmdk>
        <CmdkInput placeholder="Type a command or search..." className="border-b border-grayA-3" />
        <CmdkList>
          <CmdkEmpty>No results found.</CmdkEmpty>

          <CmdkGroup heading="Compose">
            <CmdkItem>
              <Icons.Plus />
              Create new thread
            </CmdkItem>
            <CmdkItem>
              <Icons.Plus />
              Create new generation
            </CmdkItem>
          </CmdkGroup>

          <CmdkGroup heading="Recent">
            {threads
              ? threads.map((thread) => (
                  <Link key={thread._id} href={`/dev/lo36/c/${thread.slug}`} onClick={closeDialog}>
                    <CmdkItem value={thread.title ?? 'untitled ' + thread.slug}>
                      {thread.model?.type === 'chat' ? <Icons.Chat /> : <Icons.ImageSquare />}
                      <div className="truncate">{thread.title ?? 'Untitled'}</div>
                    </CmdkItem>
                  </Link>
                ))
              : null}
          </CmdkGroup>

          <CmdkGroup heading="Settings">
            <CmdkItem>
              <Icons.User />
              Profile
            </CmdkItem>
            <CmdkItem>
              <Icons.Gear />
              Preferences
            </CmdkItem>
            <CmdkItem>
              <Icons.SignOut />
              Log out
            </CmdkItem>
          </CmdkGroup>
        </CmdkList>
      </Cmdk>
    </div>
  )
}

const CommandShellDialog = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useAtom(commandShellOpenAtom)

  useKeyboardEvent('k', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      setOpen(!open)
    }
  })

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger>{children}</Dialog.Trigger> : null}
      <Dialog.Content
        align="start"
        maxWidth="42rem"
        className="rounded-md p-0"
        aria-describedby={undefined}
      >
        <Dialog.Title className="sr-only">Command Menu</Dialog.Title>
        <CommandShellMenu />
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const CommandShell = CommandShellDialog
