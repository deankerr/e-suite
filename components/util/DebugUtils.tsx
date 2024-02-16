import { cn } from '@/lib/utils'
import { SquirrelIcon } from 'lucide-react'
import { useRef } from 'react'

export const DebugCornerMarkers = ({
  n,
  cN: className,
  no,
}: {
  n?: number
  cN?: React.ComponentProps<'div'>['className']
  no?: boolean
}) => {
  const int = useRef(n ?? rndInt())
  if (no) return null
  return (
    <>
      <div className="absolute left-1 top-1">
        <SquirrelIcon className={cn('size-5', textColor(int.current), className)} />
      </div>
      <div className="absolute right-1 top-1">
        <SquirrelIcon className={cn('size-5', textColor(int.current), className)} />
      </div>
      <div className="absolute bottom-1 left-1">
        <SquirrelIcon className={cn('size-5', textColor(int.current), className)} />
      </div>
      <div className="absolute bottom-1 right-1">
        <SquirrelIcon className={cn('size-5', textColor(int.current), className)} />
      </div>
    </>
  )
}

const colors = [
  'text-tomato',
  'text-crimson',
  'text-pink',
  'text-purple',
  'text-iris',
  'text-cyan',
  'text-grass',
  'text-amber',
]

const textColor = (num: number) => colors[num % 8]!
const rndInt = () => Math.floor(Math.random() * 8)
