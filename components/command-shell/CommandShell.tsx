'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Dialog } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'

import {
  Cmdk,
  CmdkEmpty,
  CmdkGroup,
  CmdkInput,
  CmdkItem,
  CmdkList,
} from '@/components/command-shell/components/Cmdk'
import { AppLogoName } from '@/components/ui/AppLogoName'
import { commandShellOpenAtom } from '@/lib/atoms'

const CommandShellMenu = () => {
  return (
    <div className="flex h-full max-h-[55vh] flex-col sm:max-h-none">
      {/* * header * */}
      <div className="flex shrink-0 items-center gap-2 border-b border-grayA-3 px-3 py-2">
        <AppLogoName />
        <div className="ml-auto font-mono text-xs text-gray-11">Command Shell</div>
      </div>

      {/* * menu * */}
      <Cmdk>
        <CmdkInput placeholder="Type a command or search..." className="border-b border-grayA-3" />
        <CmdkList>
          <CmdkEmpty>No results found.</CmdkEmpty>

          <CmdkGroup heading="Threads">
            <CmdkItem>
              <Icons.Plus />
              Create new thread
            </CmdkItem>
            <CmdkItem>
              <Icons.MagnifyingGlass />
              Search threads...
            </CmdkItem>
            <CmdkItem>
              <Icons.Chat />
              Conversations with e
            </CmdkItem>
            <CmdkItem>
              <Icons.Chat />
              Who am I?
            </CmdkItem>
            <CmdkItem>
              <Icons.Chat />
              How to change a tyre
            </CmdkItem>
            <CmdkItem>
              <Icons.Chat />
              React useMemo
            </CmdkItem>
          </CmdkGroup>

          <CmdkGroup heading="Generations">
            <CmdkItem>
              <Icons.Plus />
              Create new generation
            </CmdkItem>
            <CmdkItem>
              <Icons.MagnifyingGlass />
              Search generations...
            </CmdkItem>
            <CmdkItem>
              <Icons.ImageSquare />
              SD3: Medium
            </CmdkItem>
            <CmdkItem>
              <Icons.ImageSquare />
              Pixart Generations
            </CmdkItem>
            <CmdkItem>
              <Icons.ImageSquare />
              Anime Babes
            </CmdkItem>
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
