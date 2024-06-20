import { HeadCircuit, Question, User } from '@phosphor-icons/react/dist/ssr'
import { Avatar as AvatarRadix } from '@radix-ui/themes'

import { AccentColors } from '@/lib/types'

const fallbackIcons: Record<string, React.ReactNode> = {
  user: <User className="size-5" />,
  assistant: <HeadCircuit className="size-5" />,
}

const colors: Record<string, AccentColors> = {
  user: 'mint',
  assistant: 'orange',
}

export const Avatar = ({ role }: { role: string }) => {
  const fallback = fallbackIcons[role] ?? <Question className="size-5" />
  const color = colors[role] ?? 'gray'
  return <AvatarRadix size="2" color={color} className="bg-gray-2" fallback={fallback} />
}
