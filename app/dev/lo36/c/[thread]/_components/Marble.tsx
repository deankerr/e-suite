import { useMemo } from 'react'
import Avatar from 'boring-avatars'

import { cn, environment, stringToHex } from '@/lib/utils'

import type { ClassNameValue } from '@/lib/utils'

const shouldUseSimpleAvatar = environment === 'dev'

const colors = [
  '#e54666',
  '#e93d82',
  '#d6409f',
  '#ab4aba',
  '#5b5bd6',
  '#0090ff',
  '#00a2c7',
  '#46a758',
  '#ad7f58',
  '#7ce2fe',
  '#bdee63',
  '#ffe629',
  '#ffc53d',
  '#f76b15',
]

export const BoringAvatar = ({
  name,
  size = 15,
  variant = 'marble',
  square = false,
}: Omit<React.ComponentProps<typeof Avatar>, 'colors'>) => {
  return useMemo(
    () => <Avatar name={name} size={size} colors={colors} variant={variant} square={square} />,
    [name, size, variant, square],
  )
}

export const Marble = ({
  className,
  ...props
}: { className?: ClassNameValue } & Omit<React.ComponentProps<typeof Avatar>, 'colors'>) => {
  return (
    <div
      className={cn('h-fit w-fit flex-none', props.square && 'overflow-hidden rounded', className)}
    >
      {shouldUseSimpleAvatar ? (
        <div
          className="size-[15px] rounded-full bg-red-6 outline -outline-offset-2 outline-grayA-7"
          style={{ backgroundColor: stringToHex(props.name ?? 'MIA') }}
        />
      ) : (
        <BoringAvatar {...props} />
      )}
    </div>
  )
}
