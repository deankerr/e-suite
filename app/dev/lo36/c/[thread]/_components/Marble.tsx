import { useMemo } from 'react'
import Avatar from 'boring-avatars'

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

export const Marble = ({
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
