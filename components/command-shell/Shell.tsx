'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Dialog, IconButton } from '@radix-ui/themes'

import { Cmdk, CmdkEmpty, CmdkInput, CmdkList } from '@/components/command-shell/components/Cmdk'
import { ModelSelect } from '@/components/command-shell/pages/ModelSelect'
import { ThreadComposer } from '@/components/command-shell/pages/ThreadComposer'
import { useShell } from '@/components/command-shell/useCommandShell'
import { AppLogoName } from '@/components/ui/AppLogoName'
import { cn } from '@/lib/utils'

export type ShellMenuLibrary = typeof pages
export type ShellMenuPageName = keyof ShellMenuLibrary

export const pages = {
  ThreadComposer: 'ThreadComposer',
  ModelSelect: 'ModelSelect',
}

export const Shell = () => {
  const shell = useShell()

  const currentPage = shell.stack.at(-1)
  const title = currentPage
    ? currentPage === 'ThreadComposer'
      ? `New ${shell.inferenceType}`
      : 'Select model'
    : ''

  return (
    <Dialog.Root open={shell.open} onOpenChange={shell.setOpen}>
      <Dialog.Content
        align="start"
        maxWidth="42rem"
        className="rounded-md p-0"
        aria-describedby={undefined}
      >
        <Dialog.Title className="sr-only">Command Menu</Dialog.Title>
        <ShellContainer title={title}>
          <Command
            className={cn(currentPage === 'ThreadComposer' && 'hidden')}
            onKeyDown={(e) => {
              console.log(e.key, e.shiftKey)
              if (e.key === '<') {
                e.preventDefault()
                console.log('pop')
                shell.pop()
              }
            }}
          >
            {shell.stack.includes('ModelSelect') && (
              <ModelSelect
                shell={shell}
                className={cn(currentPage !== 'ModelSelect' && 'hidden')}
              />
            )}
          </Command>

          {shell.stack.includes('ThreadComposer') && (
            <ThreadComposer
              shell={shell}
              className={cn(currentPage !== 'ThreadComposer' && 'hidden')}
            />
          )}
        </ShellContainer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const ShellContainer = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  return (
    <div className="flex h-full max-h-[55vh] flex-col sm:max-h-none">
      <div className="flex h-12 shrink-0 items-center gap-1 truncate border-b border-grayA-3 px-2 font-medium">
        {title ? (
          <>
            <Icons.CaretRight className="size-5 text-accentA-11" /> {title}
          </>
        ) : (
          <AppLogoName />
        )}

        <div className="grow"></div>
        <Dialog.Close>
          <IconButton variant="ghost" color="gray">
            <Icons.X className="size-5" />
          </IconButton>
        </Dialog.Close>
      </div>

      {children}
    </div>
  )
}

const Command = ({ children, ...props }: React.ComponentProps<typeof Cmdk>) => {
  return (
    <Cmdk {...props}>
      <CmdkInput placeholder="Type a command or search..." className="border-b border-grayA-3" />
      <CmdkList>
        <CmdkEmpty>No results found.</CmdkEmpty>

        {children}
      </CmdkList>
    </Cmdk>
  )
}
