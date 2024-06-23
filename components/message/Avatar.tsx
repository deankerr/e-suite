import { ImageSquare, Question, Robot, User } from '@phosphor-icons/react/dist/ssr'
import { Avatar as AvatarRadix } from '@radix-ui/themes'

import { AccentColors } from '@/lib/types'

import type { Icon } from '@phosphor-icons/react/dist/lib/types'

const fallbackIcons: Record<string, Icon> = {
  user: User,
  assistant: Robot,
  images: ImageSquare,
}

const fallbackIcon = Question

const colors: Record<string, AccentColors> = {
  user: 'mint',
  assistant: 'orange',
  images: 'orange',
}

export const Avatar = ({
  role,
  ...props
}: { role: string } & Partial<React.ComponentProps<typeof AvatarRadix>>) => {
  const Fallback = fallbackIcons[role] ?? fallbackIcon
  const color = colors[role] ?? 'gray'
  return (
    <AvatarRadix
      size={{
        initial: '1',
        xs: '2',
      }}
      color={color}
      fallback={<Fallback className="size-4 sm:size-5" />}
      {...props}
    />
  )
}
