import { cn } from '@/lib/utils'
import { Menu, Portal } from '@ark-ui/react'
import { shuffle } from 'remeda'
import { Button } from '../ui/button'
import { sampleCode, sampleInput, sampleLorem, sampleMessages } from './sample-data'
import { AgentChatHelpers } from './use-agent-chat'

type MessageBarMenuProps = {
  chat: AgentChatHelpers
  children: React.ReactNode
}

export function MessageBarMenu({ chat, children }: MessageBarMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>{children}</Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content className="rounded-md border-2 bg-background p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <Menu.Item id="reset" asChild>
            <MenuButton onClick={() => chat.resetMessages()}>Reset</MenuButton>
          </Menu.Item>

          <Menu.Separator />

          <Menu.Root positioning={{ placement: 'right-start', gutter: -2 }}>
            <Menu.TriggerItem>
              <MenuButton variant="ghost">Debug</MenuButton>
            </Menu.TriggerItem>
            <Portal>
              <Menu.Positioner>
                <Menu.Content className="rounded-md border-2 bg-background p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <Menu.Item id="lorem">
                    <MenuButton
                      onClick={() => {
                        chat.setMessages([...sampleLorem])
                      }}
                    >
                      lorem
                    </MenuButton>
                  </Menu.Item>
                  <Menu.Item id="messages">
                    <MenuButton
                      onClick={() => {
                        chat.setMessages([...sampleMessages])
                      }}
                    >
                      messages
                    </MenuButton>
                  </Menu.Item>
                  <Menu.Item id="code">
                    <MenuButton
                      onClick={() => {
                        chat.setMessages([...sampleCode])
                      }}
                    >
                      code
                    </MenuButton>
                  </Menu.Item>
                  <Menu.Item id="input">
                    <MenuButton
                      onClick={() => {
                        chat.setInput(shuffle(sampleInput)[0]!)
                      }}
                    >
                      input
                    </MenuButton>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}

type MenuButtonProps = {} & React.ComponentProps<typeof Button>

export function MenuButton({ className, children, ...props }: MenuButtonProps) {
  return (
    <Button variant="ghost" className={cn('flex w-full font-normal', className)} {...props}>
      {children}
    </Button>
  )
}
