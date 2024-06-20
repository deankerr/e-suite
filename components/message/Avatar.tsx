import { HeadCircuit, Question, User } from '@phosphor-icons/react/dist/ssr'
import { Avatar as AvatarRadix } from '@radix-ui/themes'

import { AccentColors } from '@/lib/types'

import type { Icon } from '@phosphor-icons/react/dist/lib/types'

const fallbackIcons: Record<string, Icon> = {
  user: User,
  assistant: HeadCircuit,
}

const fallbackIcon = Question

const colors: Record<string, AccentColors> = {
  user: 'mint',
  assistant: 'orange',
}

export const Avatar = ({ role }: { role: string }) => {
  const Fallback = fallbackIcons[role] ?? fallbackIcon
  const color = colors[role] ?? 'gray'
  return (
    <AvatarRadix
      size={{
        initial: '1',
        sm: '2',
      }}
      color={color}
      className="bg-gray-2"
      fallback={<Fallback className="size-4 sm:size-5" />}
    />
  )
}
