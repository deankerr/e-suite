import { cn } from '@/lib/utils'
import shapes1 from '/assets/icons/abs2.svg'
import Image from 'next/image'

export function LoadingShapes({ className, children }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('grid w-full place-content-center', className)}>
      <Image
        src={shapes1}
        className="duration-[5000ms] animate-pulse opacity-10 brightness-[.2]"
        alt="chip icon"
      />
    </div>
  )
}
