import { cn } from '@/lib/utils'
import { AvatarIcon, ChatBubbleIcon, IdCardIcon, ImageIcon } from '@radix-ui/react-icons'

type Props = {}

export function MainNav(props: Props) {
  return (
    <>
      <div className="flex w-full sm:max-w-[6rem] sm:flex-col">
        <NavTab active={true}>
          <ChatBubbleIcon />
          Chat
        </NavTab>
        <NavTab>
          <ImageIcon />
          Image
        </NavTab>
        <NavTab>
          <AvatarIcon />
          Agent
        </NavTab>
        <NavTab>
          <IdCardIcon />
          Profile
        </NavTab>
      </div>
    </>
  )
}

function NavTab(props: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className={cn(
        'flex h-16 w-full cursor-pointer flex-col justify-between text-xs transition-all hover:bg-muted hover:text-foreground sm:flex-row-reverse',
        props.active ? 'bg-muted/75 text-foreground' : 'bg-background text-foreground/50',
      )}
    >
      <div className="flex grow flex-col items-center justify-center gap-1.5">{props.children}</div>
      <div
        className={cn(
          'h-[3px] w-full sm:h-full sm:w-[3px]',
          props.active ? 'bg-primary' : 'bg-background',
        )}
      />
    </div>
  )
}
